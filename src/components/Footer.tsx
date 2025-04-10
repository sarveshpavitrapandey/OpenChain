
import { Link } from "react-router-dom";
import { FileText, Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <FileText className="h-6 w-6 text-brand-600" />
              <span className="font-bold text-xl text-brand-600">OpenChain Publish</span>
            </Link>
            <p className="text-muted-foreground max-w-md">
              A decentralized scientific publishing platform that ensures open access, fair peer review, and tokenized incentives for researchers and reviewers.
            </p>
            <div className="flex items-center space-x-4 mt-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-base mb-3">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/papers" className="text-muted-foreground hover:text-foreground transition-colors">
                  Browse Papers
                </Link>
              </li>
              <li>
                <Link to="/submit" className="text-muted-foreground hover:text-foreground transition-colors">
                  Submit Research
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-muted-foreground hover:text-foreground transition-colors">
                  My Profile
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-base mb-3">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground order-2 sm:order-1 mt-4 sm:mt-0">
            &copy; {new Date().getFullYear()} OpenChain Publish. All rights reserved.
          </p>
          <div className="flex items-center gap-4 order-1 sm:order-2">
            <div className="text-xs px-2.5 py-1 bg-science-100 text-science-800 rounded-full font-medium">
              Blockchain: Ethereum
            </div>
            <div className="text-xs px-2.5 py-1 bg-brand-100 text-brand-800 rounded-full font-medium">
              Token: OCT
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
