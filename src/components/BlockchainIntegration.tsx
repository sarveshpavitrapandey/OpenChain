
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { connectWallet, isWalletConnected, getRewardTokens } from '@/services/web3Service';
import { useToast } from '@/hooks/use-toast';
import ContractInteractions from './ContractInteractions';
import DAOGovernance from './DAOGovernance';

const BlockchainIntegration: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [tokens, setTokens] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('wallet');
  const { toast } = useToast();

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const isConnected = await isWalletConnected();
        if (isConnected) {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          setAccount(accounts[0]);
          setConnected(true);
          
          // Get token balance
          const tokenBalance = await getRewardTokens(accounts[0]);
          setTokens(tokenBalance);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    };

    checkConnection();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setConnected(true);
          
          // Update token balance when account changes
          getRewardTokens(accounts[0]).then(balance => {
            setTokens(balance);
          });
        } else {
          setAccount(null);
          setConnected(false);
          setTokens(null);
        }
      });
    }

    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  const handleConnectWallet = async () => {
    setLoading(true);
    try {
      const accounts = await connectWallet();
      setAccount(accounts[0]);
      setConnected(true);
      
      // Get token balance
      const tokenBalance = await getRewardTokens(accounts[0]);
      setTokens(tokenBalance);
      
      toast({
        title: "Wallet Connected",
        description: `Connected to ${accounts[0].substring(0, 8)}...${accounts[0].substring(accounts[0].length - 6)}`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Blockchain Integration
            {connected && <Badge variant="outline" className="ml-2">Connected</Badge>}
          </CardTitle>
          <CardDescription>Connect your wallet to access decentralized features</CardDescription>
        </CardHeader>
        <CardContent>
          {connected ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Account:</span>
                <span className="font-mono text-sm">
                  {account?.substring(0, 8)}...{account?.substring(account.length - 6)}
                </span>
              </div>
              {tokens !== null && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">OpenChain Tokens:</span>
                  <span className="font-mono text-sm">{tokens} OCT</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-center text-muted-foreground">
              No wallet connected. Connect your wallet to interact with the OpenChain platform.
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleConnectWallet} 
            disabled={connected || loading} 
            className="w-full"
            variant={connected ? "outline" : "default"}
          >
            {loading ? "Connecting..." : connected ? "Connected" : "Connect Wallet"}
          </Button>
        </CardFooter>
      </Card>
      
      {connected && (
        <Tabs defaultValue="papers" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="papers">Papers & Reviews</TabsTrigger>
            <TabsTrigger value="governance">DAO Governance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="papers">
            <ContractInteractions account={account} />
          </TabsContent>
          
          <TabsContent value="governance">
            <DAOGovernance account={account} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default BlockchainIntegration;
