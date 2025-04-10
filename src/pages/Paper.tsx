
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, BookOpen, Calendar, Download, Eye, FileText, Star, ThumbsUp, User } from "lucide-react";
import { getPaperById } from "@/data/papers";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { sendTokensToAuthor } from "@/services/tokenService";
import { isWalletConnected } from "@/services/web3Service";

const Paper = () => {
  const { id } = useParams<{ id: string }>();
  const paper = getPaperById(id || "");
  const { toast } = useToast();
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [upvoted, setUpvoted] = useState(false);
  
  useEffect(() => {
    const checkWallet = async () => {
      const walletConnected = await isWalletConnected();
      setConnected(walletConnected);
    };
    
    checkWallet();
  }, []);
  
  if (!paper) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container py-16 px-4 md:px-6 flex flex-col items-center justify-center">
          <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Paper Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The research paper you are looking for does not exist or has been removed.
          </p>
          <Link to="/papers">
            <Button>Browse All Papers</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }
  
  const getStatusBadge = () => {
    switch (paper.status) {
      case "published":
        return <Badge className="bg-green-500">Published</Badge>;
      case "under review":
        return <Badge className="bg-yellow-500">Under Review</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-500">{paper.status}</Badge>;
    }
  };
  
  const handleDownload = () => {
    setLoading(true);
    
    // Simulate download delay
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Download Started",
        description: "Your paper download has started.",
      });
    }, 1000);
  };
  
  const handleRewardAuthor = async () => {
    if (!connected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to reward authors.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Get the connected account
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      const account = accounts[0];
      
      // Send 5 tokens to the author
      await sendTokensToAuthor(paper.author.wallet, 5, account);
      
      setShowAlert(true);
      toast({
        title: "Author Rewarded",
        description: "You've sent 5 OCT tokens to the author as appreciation.",
      });
    } catch (error) {
      console.error("Error rewarding author:", error);
      toast({
        title: "Reward Failed",
        description: "There was an error sending tokens. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpvote = () => {
    if (!connected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to upvote papers.",
        variant: "destructive",
      });
      return;
    }
    
    setUpvoted(!upvoted);
    
    toast({
      title: upvoted ? "Upvote Removed" : "Paper Upvoted",
      description: upvoted 
        ? "You've removed your upvote from this paper." 
        : "Thanks for supporting this research!",
    });
  };
  
  const handleVerifyOnEtherscan = () => {
    // Open etherscan link in new tab
    if (paper.hash) {
      window.open(`https://etherscan.io/tx/${paper.hash}`, '_blank');
    } else {
      // Use a mock transaction hash if real one isn't available
      window.open(`https://etherscan.io/tx/0x7c3b2d0e1f6a5c8b9d2e3f4a5c6b7d8e9f0a1b2c`, '_blank');
    }
    
    toast({
      title: "Opening Etherscan",
      description: "Redirecting to Etherscan to verify this paper's transaction.",
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-brand-50 py-8">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {getStatusBadge()}
                  {paper.doi && (
                    <Badge variant="outline" className="font-mono text-xs">
                      DOI: {paper.doi}
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl font-bold">{paper.title}</h1>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={paper.author.avatar} alt={paper.author.name} />
                      <AvatarFallback>{paper.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{paper.author.name}</p>
                      <p className="text-xs text-muted-foreground">{paper.author.institution}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{new Date(paper.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 md:items-center">
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm">{paper.views} views</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm">{paper.citations} citations</span>
                  </div>
                </div>
                <Button variant="outline" className="gap-1" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-1" />
                  Download PDF
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-6">
              <Badge variant="outline" className="text-xs">
                {paper.category}
              </Badge>
              {paper.keywords?.map((keyword) => (
                <Badge key={keyword} variant="outline" className="text-xs bg-muted/50">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        <div className="container px-4 md:px-6 py-12">
          <Tabs defaultValue="paper">
            <TabsList className="mb-8">
              <TabsTrigger value="paper">Paper</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({paper.reviews.length})</TabsTrigger>
              <TabsTrigger value="verification">Blockchain Verification</TabsTrigger>
            </TabsList>
            
            <TabsContent value="paper">
              <div className="paper-container bg-card">
                <div className="paper-abstract">
                  <h3 className="font-bold text-lg mb-2">Abstract</h3>
                  <p>{paper.abstract}</p>
                </div>
                
                <Separator className="my-8" />
                
                <div className="paper-content">
                  <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: paper.content.replace(/\n/g, '<br />').replace(/# (.*?)\n/g, '<h2>$1</h2>') }} />
                </div>
              </div>
              
              {showAlert && (
                <Alert className="mt-8">
                  <AlertDescription className="flex items-center justify-between">
                    <span>You've rewarded the author with 5 OCT tokens for this valuable research.</span>
                    <Button variant="outline" size="sm" onClick={() => setShowAlert(false)}>
                      Dismiss
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="mt-8 flex flex-col md:flex-row gap-4 justify-between">
                <div className="flex items-center gap-4">
                  <Button 
                    variant="outline" 
                    className={`gap-1 ${upvoted ? 'bg-blue-50 border-blue-200' : ''}`}
                    onClick={handleUpvote}
                    disabled={loading}
                  >
                    <ThumbsUp className={`h-4 w-4 mr-1 ${upvoted ? 'text-blue-500 fill-blue-500' : ''}`} />
                    {upvoted ? 'Upvoted' : 'Upvote'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="gap-1" 
                    onClick={handleRewardAuthor}
                    disabled={loading}
                  >
                    <Star className="h-4 w-4 mr-1" />
                    {loading ? 'Processing...' : 'Reward Author'}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">{paper.tokens} OCT</span> tokens earned by author
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews">
              <div className="space-y-6">
                {paper.reviews.filter(r => r.status === "completed").map((review) => (
                  <Card key={review.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={review.reviewer.avatar} alt={review.reviewer.name} />
                            <AvatarFallback>{review.reviewer.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base">{review.reviewer.name}</CardTitle>
                            <p className="text-xs text-muted-foreground">{review.reviewer.institution}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {Array(5).fill(0).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-muted"}`}
                            />
                          ))}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{review.content}</p>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString()}</span>
                        <Badge variant="outline" className="text-xs">
                          {review.tokens} OCT earned
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {paper.reviews.filter(r => r.status === "pending").length > 0 && (
                  <div className="text-center py-4 bg-muted/50 rounded-lg border border-dashed">
                    <p className="text-muted-foreground">
                      {paper.reviews.filter(r => r.status === "pending").length} pending reviews
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="verification">
              <div className="bg-card p-8 rounded-lg">
                <div className="text-center mb-8">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 mb-4">
                    <FileText className="h-8 w-8 text-brand-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-1">Blockchain Verification</h3>
                  <p className="text-muted-foreground">
                    This research paper has been cryptographically verified and secured on the blockchain
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm text-muted-foreground mb-1">Transaction Hash</h4>
                    <p className="font-mono text-sm bg-muted/50 p-2 rounded-md break-all">
                      {paper.hash || "0x7c3b2d0e1f6a5c8b9d2e3f4a5c6b7d8e9f0a1b2c"}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm text-muted-foreground mb-1">Timestamp</h4>
                    <p className="font-mono text-sm bg-muted/50 p-2 rounded-md">
                      {new Date(paper.date).toISOString()}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm text-muted-foreground mb-1">Network</h4>
                    <p className="font-mono text-sm bg-muted/50 p-2 rounded-md">
                      Ethereum Mainnet
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm text-muted-foreground mb-1">Author Wallet</h4>
                    <p className="font-mono text-sm bg-muted/50 p-2 rounded-md break-all">
                      {paper.author.wallet}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-sm text-muted-foreground mb-1">Content Hash (SHA-256)</h4>
                  <p className="font-mono text-sm bg-muted/50 p-2 rounded-md break-all">
                    e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                  </p>
                </div>
                
                <div className="mt-8 flex justify-center">
                  <Button 
                    variant="outline" 
                    className="gap-1"
                    onClick={handleVerifyOnEtherscan}
                  >
                    <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L6 12H18L12 22V2Z" fill="currentColor" />
                    </svg>
                    Verify on Etherscan
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Paper;
