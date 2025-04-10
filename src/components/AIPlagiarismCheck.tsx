import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, AlertTriangle, Clock, Brain, KeyRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { checkPlagiarismWithGemini } from "@/services/geminiService";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PlagiarismResult {
  originalityScore: number;
  flaggedSections: Array<{
    text: string;
    similarity: number;
    source?: string;
  }>;
  status: 'clean' | 'suspicious' | 'plagiarized';
}

const AIPlagiarismCheck = () => {
  const [text, setText] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<PlagiarismResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [apiKeyConfigured, setApiKeyConfigured] = useState(false);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();

  // Check if API key is configured
  useEffect(() => {
    const checkApiKey = () => {
      const hasApiKey = !!window.GEMINI_API_KEY || !!localStorage.getItem('GEMINI_API_KEY');
      
      if (hasApiKey && !apiKeyConfigured) {
        // Set the API key in window object if it's in localStorage but not in window
        if (localStorage.getItem('GEMINI_API_KEY') && !window.GEMINI_API_KEY) {
          window.GEMINI_API_KEY = localStorage.getItem('GEMINI_API_KEY');
        }
        setApiKeyConfigured(true);
        setErrorMsg(null);
      } else if (!hasApiKey) {
        setApiKeyConfigured(false);
        setErrorMsg("Gemini API key is not configured. Please add your API key to use this feature.");
      }
    };
    
    // Check immediately and also whenever the window object might be updated
    checkApiKey();
    
    // Set up an interval to periodically check if the API key has been added
    const intervalId = setInterval(checkApiKey, 2000);
    
    return () => clearInterval(intervalId);
  }, [apiKeyConfigured]);
  
  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('GEMINI_API_KEY', apiKey);
      window.GEMINI_API_KEY = apiKey;
      setShowApiKeyDialog(false);
      setApiKeyConfigured(true);
      setErrorMsg(null);
      toast({
        title: "API Key Saved",
        description: "Gemini API key has been saved successfully.",
      });
    } else {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid API key.",
        variant: "destructive",
      });
    }
  };
  
  const checkPlagiarism = async () => {
    if (text.trim().length < 100) {
      toast({
        title: "Text too short",
        description: "Please enter at least 100 characters to perform a meaningful check.",
        variant: "destructive",
      });
      return;
    }

    if (!window.GEMINI_API_KEY) {
      setShowApiKeyDialog(true);
      return;
    }

    setIsChecking(true);
    setErrorMsg(null);
    
    try {
      const plagiarismResult = await checkPlagiarismWithGemini(text);
      setResult(plagiarismResult);
      
      // Show toast notification with result
      toast({
        title: plagiarismResult.status === 'clean' ? "Content is original" : 
               plagiarismResult.status === 'suspicious' ? "Potential similarity detected" : "Plagiarism detected",
        description: `Originality score: ${plagiarismResult.originalityScore.toFixed(1)}%`,
        variant: plagiarismResult.status === 'clean' ? "default" : "destructive",
      });
      
    } catch (error) {
      console.error("Error checking plagiarism:", error);
      setErrorMsg(error instanceof Error ? error.message : "Unknown error occurred");
      toast({
        title: "Error checking plagiarism",
        description: "There was an error while checking for plagiarism. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusColor = () => {
    if (!result) return "bg-gray-200";
    if (result.status === 'clean') return "bg-green-500";
    if (result.status === 'suspicious') return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            AI Plagiarism & Fraud Detection
          </CardTitle>
          <CardDescription>
            Check your research paper for potential plagiarism and fraudulent content before submission using Gemini AI
          </CardDescription>
          {!apiKeyConfigured && (
            <div className="mt-2 flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-2 rounded-md">
              <KeyRound className="h-4 w-4" />
              <span>Gemini API key is not configured. <Button 
                variant="link" 
                className="h-auto p-0 text-amber-700" 
                onClick={() => setShowApiKeyDialog(true)}
              >
                Add API Key
              </Button></span>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea 
            placeholder="Paste your research content here to check for plagiarism..." 
            className="min-h-[200px]"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
              <p className="font-medium">Error: {errorMsg}</p>
            </div>
          )}
          
          {result && (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Originality Score</span>
                  <span className="text-sm font-bold">{result.originalityScore.toFixed(1)}%</span>
                </div>
                <Progress value={result.originalityScore} className={getStatusColor()} />
              </div>
              
              {result.flaggedSections.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Flagged Content:</p>
                  {result.flaggedSections.map((section, index) => (
                    <div key={index} className="p-3 bg-gray-50 border rounded-md text-sm">
                      <div className="flex justify-between">
                        <p className="italic">"{section.text}"</p>
                        <Badge variant={result.status === 'plagiarized' ? "destructive" : "outline"}>
                          {section.similarity.toFixed(1)}% Similar
                        </Badge>
                      </div>
                      {section.source && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Possible source: {section.source}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex items-center gap-2 text-sm">
                <Badge className={
                  result.status === 'clean' ? "bg-green-100 text-green-800 hover:bg-green-100" : 
                  result.status === 'suspicious' ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" : 
                  "bg-red-100 text-red-800 hover:bg-red-100"
                }>
                  {result.status === 'clean' && <Check className="h-3 w-3 mr-1" />}
                  {result.status === 'suspicious' && <Clock className="h-3 w-3 mr-1" />}
                  {result.status === 'plagiarized' && <AlertTriangle className="h-3 w-3 mr-1" />}
                  {result.status === 'clean' ? 'Original Content' : 
                   result.status === 'suspicious' ? 'Potential Similarity' : 'Plagiarism Detected'}
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            onClick={apiKeyConfigured ? checkPlagiarism : () => setShowApiKeyDialog(true)}
            disabled={isChecking || text.trim().length < 100}
            className="w-full"
          >
            {isChecking ? 
              <span className="flex items-center gap-2">
                <span className="animate-spin w-4 h-4 border-2 border-white border-r-transparent rounded-full"></span>
                Analyzing with Gemini AI...
              </span> 
              : apiKeyConfigured ? "Check for Plagiarism" : "Configure API Key"
            }
          </Button>
        </CardFooter>
      </Card>
      
      <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5" />
              Configure Gemini API Key
            </DialogTitle>
            <DialogDescription>
              To use the AI plagiarism detection feature, you need to provide a Gemini API key.
              You can get a key from the <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google AI Studio</a>.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gemini-api-key" className="text-right">
                API Key
              </Label>
              <Input
                id="gemini-api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Gemini API key"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleSaveApiKey}>
              Save API Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AIPlagiarismCheck;
