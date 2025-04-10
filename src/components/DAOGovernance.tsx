
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { submitProposal, castVote, getProposals, submitDispute, voteOnDispute } from '@/services/web3Service';
import { getReviewerReputation } from '@/services/web3Service';
import { GavelIcon, Vote, Scale, FileText, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const DAOGovernance: React.FC<{ account: string | null }> = ({ account }) => {
  const [activeTab, setActiveTab] = useState('proposals');
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalDescription, setProposalDescription] = useState('');
  const [reputation, setReputation] = useState<number | null>(null);
  const [disputePaperId, setDisputePaperId] = useState('');
  const [disputeReason, setDisputeReason] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (account) {
      fetchProposals();
      fetchReputation();
    }
  }, [account]);

  const fetchProposals = async () => {
    if (!account) return;
    
    try {
      setLoading(true);
      const proposalData = await getProposals(account);
      setProposals(proposalData);
    } catch (error: any) {
      toast({
        title: "Failed to load proposals",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchReputation = async () => {
    if (!account) return;
    
    try {
      const repScore = await getReviewerReputation(account);
      setReputation(repScore);
    } catch (error) {
      console.error("Failed to load reputation score:", error);
    }
  };

  const handleSubmitProposal = async () => {
    if (!account) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to submit proposals.",
        variant: "destructive",
      });
      return;
    }

    if (!proposalTitle || !proposalDescription) {
      toast({
        title: "Missing Information",
        description: "Please provide both a title and description for your proposal.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const hash = await submitProposal(proposalTitle, proposalDescription, account);
      
      toast({
        title: "Proposal Submitted",
        description: "Your proposal has been submitted to the DAO for voting.",
      });
      
      setProposalTitle('');
      setProposalDescription('');
      fetchProposals();
      
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit proposal to blockchain.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (proposalId: string, support: boolean) => {
    if (!account) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to vote.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const hash = await castVote(proposalId, support, account);
      
      toast({
        title: "Vote Cast",
        description: `You have successfully voted ${support ? 'for' : 'against'} the proposal.`,
      });
      
      fetchProposals();
      
    } catch (error: any) {
      toast({
        title: "Vote Failed",
        description: error.message || "Failed to cast vote on blockchain.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitDispute = async () => {
    if (!account) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to submit a dispute.",
        variant: "destructive",
      });
      return;
    }

    if (!disputePaperId || !disputeReason) {
      toast({
        title: "Missing Information",
        description: "Please provide both a paper ID and reason for your dispute.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const hash = await submitDispute(disputePaperId, disputeReason, account);
      
      toast({
        title: "Dispute Submitted",
        description: "Your dispute has been submitted for community moderation.",
      });
      
      setDisputePaperId('');
      setDisputeReason('');
      
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit dispute to blockchain.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const VotingWeight = () => (
    <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md border border-amber-200 dark:border-amber-800 mt-4">
      <div className="flex items-center gap-2">
        <Scale className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <span className="text-sm font-medium text-amber-800 dark:text-amber-400">Quadratic Voting Power</span>
      </div>
      <p className="text-xs text-amber-800 dark:text-amber-400 mt-1">
        Your voting power is calculated using the square root of your token holdings, ensuring a more democratic voting system.
      </p>
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GavelIcon className="h-5 w-5 text-primary" />
          DAO Governance
        </CardTitle>
        <CardDescription>
          Participate in decentralized governance of the OpenChain research platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="proposals" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="proposals">Proposals</TabsTrigger>
            <TabsTrigger value="reputation">Reputation</TabsTrigger>
            <TabsTrigger value="disputes">Disputes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="proposals" className="space-y-4">
            <div className="space-y-4 mt-4">
              <h3 className="text-lg font-medium">Submit New Proposal</h3>
              <div className="space-y-2">
                <Label htmlFor="proposal-title">Proposal Title</Label>
                <Input
                  id="proposal-title"
                  placeholder="Enter a title for your proposal"
                  value={proposalTitle}
                  onChange={(e) => setProposalTitle(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="proposal-description">Proposal Description</Label>
                <Textarea
                  id="proposal-description"
                  placeholder="Describe your proposal in detail"
                  value={proposalDescription}
                  onChange={(e) => setProposalDescription(e.target.value)}
                  rows={4}
                />
              </div>
              
              <Button 
                onClick={handleSubmitProposal} 
                disabled={loading || !account} 
                className="w-full"
              >
                {loading ? "Submitting..." : "Submit Proposal"}
              </Button>
              
              <VotingWeight />
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Active Proposals</h3>
              {proposals.length > 0 ? (
                <div className="space-y-4">
                  {proposals.map((proposal) => (
                    <div key={proposal.id} className="border rounded-md p-4">
                      <h4 className="font-medium">{proposal.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{proposal.description}</p>
                      <div className="flex items-center justify-between mt-4">
                        <div className="text-sm">
                          <span className="text-green-600 dark:text-green-400 font-medium">{proposal.votesFor} For</span>
                          {" · "}
                          <span className="text-red-600 dark:text-red-400 font-medium">{proposal.votesAgainst} Against</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleVote(proposal.id, true)}
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-200 hover:bg-green-50"
                            disabled={loading || !account}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            For
                          </Button>
                          <Button
                            onClick={() => handleVote(proposal.id, false)}
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            disabled={loading || !account}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Against
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  {loading ? "Loading proposals..." : "No active proposals found"}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="reputation" className="space-y-4">
            <div className="mt-4 text-center py-8 border rounded-md">
              <div className="text-5xl font-bold text-primary mb-2">
                {reputation !== null ? reputation : '...'}
              </div>
              <p className="text-sm text-muted-foreground">Your Reviewer Reputation Score</p>
              
              <div className="max-w-md mx-auto mt-6 text-left">
                <h4 className="font-medium mb-2">How to Increase Your Reputation:</h4>
                <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
                  <li>Submit high-quality reviews that are approved by authors</li>
                  <li>Participate actively in DAO governance voting</li>
                  <li>Have your research papers receive positive ratings</li>
                  <li>Help moderate disputes fairly and consistently</li>
                </ul>
              </div>
            </div>
            
            <VotingWeight />
          </TabsContent>
          
          <TabsContent value="disputes" className="space-y-4">
            <div className="space-y-4 mt-4">
              <h3 className="text-lg font-medium">Submit Dispute</h3>
              <div className="space-y-2">
                <Label htmlFor="dispute-paper-id">Paper ID</Label>
                <Input
                  id="dispute-paper-id"
                  placeholder="Enter the ID of the paper in dispute"
                  value={disputePaperId}
                  onChange={(e) => setDisputePaperId(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dispute-reason">Reason for Dispute</Label>
                <Textarea
                  id="dispute-reason"
                  placeholder="Explain why you're disputing this paper or review"
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  rows={4}
                />
              </div>
              
              <Button 
                onClick={handleSubmitDispute} 
                disabled={loading || !account} 
                className="w-full"
              >
                {loading ? "Submitting..." : "Submit Dispute"}
              </Button>
              
              <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md border border-amber-200 dark:border-amber-800 mt-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-sm font-medium text-amber-800 dark:text-amber-400">Community Moderation</span>
                </div>
                <p className="text-xs text-amber-800 dark:text-amber-400 mt-1">
                  Disputes are resolved through community voting. High-reputation members have more influence in the resolution process.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-xs text-muted-foreground">
          {account ? `Connected as ${account.substring(0, 6)}...${account.substring(account.length - 4)}` : 'Not connected'}
        </div>
      </CardFooter>
    </Card>
  );
};

export default DAOGovernance;
