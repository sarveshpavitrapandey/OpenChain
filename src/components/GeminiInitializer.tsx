
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound } from 'lucide-react';

const GeminiInitializer = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  
  useEffect(() => {
    // Check if API key is available from environment variables
    const savedApiKey = localStorage.getItem('GEMINI_API_KEY') || import.meta.env.VITE_GEMINI_API_KEY || '';
    
    // Set the API key in the window object
    if (savedApiKey) {
      window.GEMINI_API_KEY = 'AIzaSyA9R5eASdFxBPigyqMvSgV2n2cuv_JGri4';
      console.log("Gemini API key configured successfully");
    } else {
      console.warn("Gemini API key not configured");
      setShowDialog(true);
      toast({
        title: "Gemini API Key Missing",
        description: "Please set your Gemini API Key to use the plagiarism detection feature.",
        variant: "destructive",
      });
    }
  }, [toast]);
  
  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('GEMINI_API_KEY', apiKey);
      window.GEMINI_API_KEY = apiKey;
      setShowDialog(false);
      toast({
        title: "API Key Saved",
        description: "Gemini API key has been saved successfully.",
      });
      
      // Reload the page to ensure components using the API key are updated
      window.location.reload();
    } else {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid API key.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
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
            <Label htmlFor="api-key" className="text-right">
              API Key
            </Label>
            <Input
              id="api-key"
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
  );
};

export default GeminiInitializer;
