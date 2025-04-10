
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Lock, ShieldCheck, Zap, Coins } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ZKRollupIntegration = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [transactionCount, setTransactionCount] = useState(0);
  const [rollupBatch, setRollupBatch] = useState(0);
  const [transactionSpeed, setTransactionSpeed] = useState(0);
  const [ethSaved, setEthSaved] = useState(0);
  const { toast } = useToast();
  
  const simulateZkRollup = async () => {
    setIsSimulating(true);
    
    try {
      // Start with clean slate for demo
      setTransactionCount(0);
      setRollupBatch(0);
      setTransactionSpeed(0);
      setEthSaved(0);
      
      // Simulate ZK-rollup batching process
      const totalTransactions = 100;
      const batchSize = 25;
      const batchCount = totalTransactions / batchSize;
      
      for (let batch = 1; batch <= batchCount; batch++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update stats for this batch
        setTransactionCount(prev => prev + batchSize);
        setRollupBatch(batch);
        setTransactionSpeed(1000); // 1000 TPS
        
        // Calculate ETH saved (simplified model)
        // In a normal L1, each tx might cost ~0.005 ETH
        // In a rollup, it might be ~0.0002 ETH per tx
        const ethPerTxL1 = 0.005;
        const ethPerTxL2 = 0.0002;
        const ethSavedThisBatch = (ethPerTxL1 - ethPerTxL2) * batchSize;
        setEthSaved(prev => prev + ethSavedThisBatch);
        
        toast({
          title: `ZK-Rollup Batch ${batch} Processed`,
          description: `${batchSize} transactions validated cryptographically and committed to mainnet`,
        });
      }
      
      toast({
        title: "All Transactions Validated",
        description: `${totalTransactions} transactions processed with ZK-rollups, saving ${ethSaved.toFixed(4)} ETH`,
        variant: "default",
      });
      
    } catch (error) {
      console.error("Error in ZK-Rollup simulation:", error);
      toast({
        title: "Simulation Error",
        description: "There was an error simulating the ZK-rollup process",
        variant: "destructive",
      });
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <Card className="w-full overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-900">
      <CardHeader className="bg-blue-50/50 dark:bg-slate-800/50 pb-4">
        <CardTitle className="flex items-center gap-2 text-primary">
          <Lock className="h-6 w-6" />
          ZK-Rollup Technology
        </CardTitle>
        <CardDescription className="text-base">
          Scale blockchain transactions with zero-knowledge proofs while maintaining security
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-xl p-4 flex flex-col items-center justify-center bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <Zap className="h-8 w-8 text-amber-500 mb-2" />
            <div className="text-2xl font-bold">{transactionSpeed}</div>
            <div className="text-sm text-muted-foreground">Transactions per second</div>
          </div>
          
          <div className="border rounded-xl p-4 flex flex-col items-center justify-center bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <Coins className="h-8 w-8 text-blue-500 mb-2" />
            <div className="text-2xl font-bold">{ethSaved.toFixed(4)}</div>
            <div className="text-sm text-muted-foreground">ETH saved</div>
          </div>
        </div>
        
        <div className="border rounded-xl p-5 bg-white dark:bg-slate-800 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Transactions Processed</span>
            <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20">{transactionCount} / 100</Badge>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
            <div 
              className="bg-primary h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${transactionCount}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
            <span>Layer 2</span>
            <div className="flex items-center">
              <ArrowRight className="h-3 w-3 mx-1" />
            </div>
            <span>Layer 1</span>
          </div>
        </div>
        
        <div className="border rounded-xl p-5 bg-white dark:bg-slate-800 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Rollup Batches</span>
            <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20">{rollupBatch} / 4</Badge>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${(rollupBatch / 4) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="bg-blue-50 dark:bg-slate-700/50 rounded-xl p-5 text-sm">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="h-5 w-5 text-green-500" />
            <h3 className="font-medium">How ZK-Rollups Work:</h3>
          </div>
          <ol className="list-decimal pl-5 space-y-1.5">
            <li>Multiple transactions are batched together off-chain</li>
            <li>A zero-knowledge proof validates the entire batch integrity</li>
            <li>Only the proof is submitted to the main blockchain</li>
            <li>Security is maintained while throughput increases dramatically</li>
            <li>Significantly reduces transaction costs in ETH</li>
          </ol>
        </div>
        
        <Button 
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md" 
          onClick={simulateZkRollup} 
          disabled={isSimulating}
        >
          {isSimulating ? "Simulating ZK-Rollup..." : "Simulate ZK-Rollup Process"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ZKRollupIntegration;
