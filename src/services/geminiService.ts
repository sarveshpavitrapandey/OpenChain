
import { env } from '../config/env';

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

interface PlagiarismResult {
  originalityScore: number;
  flaggedSections: Array<{
    text: string;
    similarity: number;
    source?: string;
  }>;
  status: 'clean' | 'suspicious' | 'plagiarized';
}

export const checkPlagiarismWithGemini = async (text: string): Promise<PlagiarismResult> => {
  try {
    // Try to get API key from env config, window object, or localStorage
    const apiKey = env.geminiApiKey || window.GEMINI_API_KEY || localStorage.getItem('GEMINI_API_KEY');
    
    if (!apiKey) {
      throw new Error("API key for content analysis is not configured. Please contact the administrator.");
    }

    const prompt = `
      You are a content originality detection expert. Analyze the following text for potential similarity with existing content:
      
      "${text}"
      
      Respond in the following JSON format only, without any additional text:
      {
        "originalityScore": [number between 0-100, higher means more original],
        "flaggedSections": [
          {
            "text": "quoted text that appears similar to existing content",
            "similarity": [number between 0-100 indicating similarity level],
            "source": "potential source if identifiable, otherwise null"
          }
        ],
        "status": ["clean" if score > 80, "suspicious" if score between 50-80, "plagiarized" if score < 50]
      }
    `;

    console.log("Sending request to Gemini API for content analysis...");
    
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      throw new Error(`Content analysis service returned an error: ${response.status}`);
    }

    const data = await response.json() as GeminiResponse;
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No response from content analysis service");
    }

    const resultText = data.candidates[0].content.parts[0].text;
    
    // Extract JSON from the response (handle potential text before/after JSON)
    const jsonMatch = resultText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse result from content analysis service");
    }
    
    const result = JSON.parse(jsonMatch[0]) as PlagiarismResult;
    console.log("Content originality analysis complete:", result);

    return result;
  } catch (error) {
    console.error("Error in content analysis:", error);
    throw error;
  }
};

// Declare the global API key so TypeScript doesn't complain
declare global {
  interface Window {
    GEMINI_API_KEY?: string;
  }
}
