
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { publishPaper } from '@/services/paperService';
import { FileCode, Send, Check, Shield, AlertCircle } from 'lucide-react';
import { OffchainMetadata } from '@/types/blockchain';
import { checkPlagiarismWithGemini } from '@/services/geminiService';
import { Progress } from '@/components/ui/progress';

interface PaperSubmissionFormProps {
  account: string | null;
}

const PaperSubmissionForm: React.FC<PaperSubmissionFormProps> = ({ account }) => {
  const [title, setTitle] = useState('');
  const [cid, setCid] = useState('');
  const [abstract, setAbstract] = useState('');
  const [content, setContent] = useState('');
  const [keywords, setKeywords] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [isCheckingPlagiarism, setIsCheckingPlagiarism] = useState(false);
  const [plagiarismResult, setPlagiarismResult] = useState<{
    originalityScore?: number;
    status?: 'clean' | 'suspicious' | 'plagiarized';
    flaggedSections?: Array<{ text: string; similarity: number; source?: string }>;
  } | null>(null);
  const { toast } = useToast();

  const PLAGIARISM_THRESHOLD = 15; // 15% plagiarism threshold

  const handlePublish = async () => {
    if (!account) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to publish papers.",
        variant: "destructive",
      });
      return;
    }

    if (!title || !cid) {
      toast({
        title: "Missing Information",
        description: "Please provide both a title and CID for your paper.",
        variant: "destructive",
      });
      return;
    }

    if (!content && !abstract) {
      toast({
        title: "Missing Content",
        description: "Please provide either content or an abstract for your paper.",
        variant: "destructive",
      });
      return;
    }

    // Start checking for plagiarism behind the scenes
    setIsPublishing(true);
    setIsCheckingPlagiarism(true);
    
    try {
      // Perform plagiarism check without telling the user it's specifically for plagiarism
      toast({
        title: "Processing Submission",
        description: "Analyzing and preparing your paper for blockchain submission...",
      });
      
      // Check plagiarism on the content or abstract
      const textToCheck = content || abstract;
      const result = await checkPlagiarismWithGemini(textToCheck);
      setPlagiarismResult(result);
      
      // If plagiarism is above threshold, block submission
      if (result.originalityScore && 100 - result.originalityScore > PLAGIARISM_THRESHOLD) {
        setIsPublishing(false);
        setIsCheckingPlagiarism(false);
        
        toast({
          title: "Publication Rejected",
          description: `Our analysis detected ${(100 - result.originalityScore).toFixed(1)}% similarity with existing content, exceeding our originality standards.`,
          variant: "destructive",
        });
        
        // Show plagiarism details but don't explicitly say it's a "plagiarism check"
        return;
      }
      
      // Continue with submission if plagiarism is below threshold
      // Prepare off-chain metadata for Supabase
      const metadata: OffchainMetadata = {
        abstract: abstract,
        keywords: keywords.split(',').map(k => k.trim()),
        originalityScore: result.originalityScore
      };

      // The digital signature will be automatically generated in the publishPaper function
      const hash = await publishPaper(cid, title, account, metadata);
      setTxHash(hash);
      
      toast({
        title: "Paper Published",
        description: "Your paper has been published to the blockchain successfully with digital signature verification!",
      });
      
    } catch (error: any) {
      toast({
        title: error.message.includes("Gemini API") ? "Analysis Failed" : "Publication Failed",
        description: error.message || "Failed to process your request.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingPlagiarism(false);
      setIsPublishing(false);
    }
  };

  const getStatusColor = () => {
    if (!plagiarismResult?.originalityScore) return "bg-gray-200";
    const score = plagiarismResult.originalityScore;
    if (score > 85) return "bg-green-500";
    if (score > 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCode className="h-5 w-5 text-primary" />
          Submit Research Paper
        </CardTitle>
        <CardDescription>
          Publish your research papers directly to the Ethereum blockchain with digital signature verification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="paper-title">Paper Title</Label>
          <Input
            id="paper-title"
            placeholder="Enter the title of your paper"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="paper-cid">Paper CID (IPFS Content Identifier)</Label>
          <Input
            id="paper-cid"
            placeholder="QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco"
            value={cid}
            onChange={(e) => setCid(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            The IPFS CID is a unique identifier for your paper stored on IPFS
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="paper-abstract">Abstract</Label>
          <Textarea
            id="paper-abstract"
            placeholder="Enter the abstract of your paper"
            value={abstract}
            onChange={(e) => setAbstract(e.target.value)}
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="paper-content">Paper Content</Label>
          <Textarea
            id="paper-content"
            placeholder="Enter your paper's content here"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="paper-keywords">Keywords</Label>
          <Input
            id="paper-keywords"
            placeholder="blockchain, research, open science"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Comma-separated keywords for your paper
          </p>
        </div>

        {plagiarismResult && 100 - plagiarismResult.originalityScore > PLAGIARISM_THRESHOLD && (
          <div className="bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800 p-4 rounded-md border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium flex items-center gap-1">
                <AlertCircle className="h-4 w-4 text-red-600" />
                Content Similarity Analysis
              </h3>
              <span className="text-sm font-bold">
                {plagiarismResult.originalityScore ? `${(100 - plagiarismResult.originalityScore).toFixed(1)}% Similar to Existing Content` : 'Analysis Failed'}
              </span>
            </div>
            <Progress value={100 - plagiarismResult.originalityScore} className="bg-red-500" />
            
            <p className="mt-2 text-sm text-red-600">
              Your submission cannot proceed as it exceeds our {PLAGIARISM_THRESHOLD}% similarity threshold.
              Please revise your content to ensure it is more original.
            </p>
          </div>
        )}

        <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md border border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span className="text-sm font-medium text-amber-800 dark:text-amber-400">Digital Signature Protection</span>
          </div>
          <p className="text-xs text-amber-800 dark:text-amber-400 mt-1">
            Your publication will be digitally signed using your wallet's private key, ensuring only you can publish papers under your name.
          </p>
        </div>

        {txHash && (
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md border border-green-200 dark:border-green-800 mt-4">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-800 dark:text-green-400">Transaction Successful</span>
            </div>
            <a 
              href={`https://etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer" 
              className="text-xs text-primary hover:underline mt-1 block truncate"
            >
              {txHash}
            </a>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handlePublish} 
          disabled={isPublishing || !account} 
          className="w-full"
        >
          {isPublishing ? (
            <>Publishing to Blockchain...</>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Publish to Blockchain
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaperSubmissionForm;
