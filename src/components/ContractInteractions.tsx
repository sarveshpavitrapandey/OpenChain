
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PaperSubmissionForm from './PaperSubmissionForm';
import { getRewardTokens } from '@/services/web3Service';

const ContractInteractions: React.FC<{ account: string | null }> = ({ account }) => {
  // We'll use this component as a wrapper for our different blockchain interactions
  return (
    <Tabs defaultValue="submit" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="submit">Submit Paper</TabsTrigger>
        <TabsTrigger value="reviews">Review Papers</TabsTrigger>
      </TabsList>
      
      <TabsContent value="submit">
        <PaperSubmissionForm account={account} />
      </TabsContent>
      
      <TabsContent value="reviews">
        <div className="text-center py-10 text-muted-foreground">
          Review submission functionality coming soon.
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ContractInteractions;
