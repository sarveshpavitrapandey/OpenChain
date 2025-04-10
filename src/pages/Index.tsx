
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import BlockchainIntegration from "@/components/BlockchainIntegration";
import AIPlagiarismCheck from "@/components/AIPlagiarismCheck";
import SemanticSearch from "@/components/SemanticSearch";
import ZKRollupIntegration from "@/components/ZKRollupIntegration";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Shield, Search, FileCode } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Blockchain Integration</h2>
          <div className="max-w-xl mx-auto">
            <BlockchainIntegration />
          </div>
        </div>
        
        <div className="bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-2 text-center">Advanced Technologies</h2>
            <p className="text-center text-muted-foreground mb-8">Cutting-edge features powering our decentralized publishing platform</p>
            
            {isMobile ? (
              <div className="space-y-6 max-w-md mx-auto">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <Search className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Semantic Search</h3>
                  </div>
                  <SemanticSearch />
                </div>
                
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">AI Fraud Detection</h3>
                  </div>
                  <AIPlagiarismCheck />
                </div>
                
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">ZK-Rollups</h3>
                  </div>
                  <ZKRollupIntegration />
                </div>
                
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <FileCode className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Smart Contract</h3>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg">
                    <p className="mb-4 text-gray-600 dark:text-gray-300">Our Solidity smart contract enables verifiable publishing and peer review on the Ethereum blockchain with an integrated token reward system.</p>
                    
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                      <h4 className="font-medium text-sm mb-2">Key Features:</h4>
                      <ul className="list-disc pl-5 text-sm space-y-1 text-gray-700 dark:text-gray-300">
                        <li>Immutable research paper records</li>
                        <li>Transparent peer review process</li>
                        <li>Automatic OCT token rewards</li>
                        <li>Cryptographic validation of ownership</li>
                        <li>On-chain reputation system</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Tabs defaultValue="search" className="w-full max-w-4xl mx-auto">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="search" className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Semantic Search
                  </TabsTrigger>
                  <TabsTrigger value="plagiarism" className="flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    AI Fraud Detection
                  </TabsTrigger>
                  <TabsTrigger value="zkrollup" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    ZK-Rollups
                  </TabsTrigger>
                  <TabsTrigger value="contract" className="flex items-center gap-2">
                    <FileCode className="h-4 w-4" />
                    Smart Contract
                  </TabsTrigger>
                </TabsList>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-slate-700">
                  <TabsContent value="search" className="mt-0">
                    <SemanticSearch />
                  </TabsContent>
                  <TabsContent value="plagiarism" className="mt-0">
                    <AIPlagiarismCheck />
                  </TabsContent>
                  <TabsContent value="zkrollup" className="mt-0">
                    <ZKRollupIntegration />
                  </TabsContent>
                  <TabsContent value="contract" className="mt-0">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-3">OpenChain Smart Contract</h3>
                      <p className="mb-4 text-gray-600 dark:text-gray-300">Our Solidity smart contract enables verifiable publishing and peer review on the Ethereum blockchain with an integrated token reward system.</p>
                      
                      <div className="bg-white dark:bg-slate-700 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-600">
                        <h4 className="font-medium text-sm mb-2">Key Features:</h4>
                        <ul className="list-disc pl-5 text-sm space-y-1 text-gray-700 dark:text-gray-300">
                          <li>Immutable research paper records</li>
                          <li>Transparent peer review process</li>
                          <li>Automatic OCT token rewards</li>
                          <li>Cryptographic validation of ownership</li>
                          <li>On-chain reputation system</li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
