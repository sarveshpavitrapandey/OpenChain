
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText, BookOpen, Users } from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-gradient-to-b from-brand-50 to-background pt-16 pb-12 md:pt-24 md:pb-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Decentralized Scientific Publishing
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Open access research publication with transparent peer review and fair tokenized rewards for all contributors.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 min-[400px]:gap-2">
            <Button 
              size="lg"
              className="gap-1"
              onClick={() => navigate("/papers")}
            >
              <BookOpen className="h-4 w-4 mr-1" />
              Browse Papers
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="gap-1"
              onClick={() => navigate("/submit")}
            >
              <FileText className="h-4 w-4 mr-1" />
              Submit Research
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="flex flex-col items-center text-center p-4">
            <div className="bg-brand-100 p-3 rounded-full mb-4">
              <FileText className="h-6 w-6 text-brand-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Open Access Publishing</h3>
            <p className="text-muted-foreground">
              Publish your research openly without paywalls and reach a global audience while maintaining ownership.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-4">
            <div className="bg-science-100 p-3 rounded-full mb-4">
              <Users className="h-6 w-6 text-science-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Transparent Peer Review</h3>
            <p className="text-muted-foreground">
              Fair and transparent peer review process with recognition and incentives for reviewers.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-4">
            <div className="bg-brand-100 p-3 rounded-full mb-4">
              <div className="flex items-center justify-center h-6 w-6 text-brand-600 font-bold">
                OCT
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">Tokenized Rewards</h3>
            <p className="text-muted-foreground">
              Earn OCT tokens for contributing research, reviews, and valuable interactions within the platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
