
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Award, UserCheck, Clock } from "lucide-react";
import { ResearchPaper } from "@/types";
import { getPublishedPapers } from "@/data/papers";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const SemanticSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<ResearchPaper[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();
  
  // Function to perform semantic search using simulated AI processing
  const performSearch = async () => {
    if (searchQuery.trim().length < 3) {
      toast({
        title: "Search query too short",
        description: "Please enter a more specific search term",
        variant: "destructive",
      });
      return;
    }
    
    setIsSearching(true);
    
    try {
      // In a real implementation, this would call an API endpoint with embeddings
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get all papers from mock data
      const allPapers = getPublishedPapers();
      
      // Mock semantic search by doing a more sophisticated filtering
      // This simulates what a real vector database would do with embeddings
      const searchTerms = searchQuery.toLowerCase().split(" ");
      
      const searchResults = allPapers.filter(paper => {
        // Calculate a semantic relevance score (this is just a simple simulation)
        let relevanceScore = 0;
        
        // Check title for matches
        searchTerms.forEach(term => {
          if (paper.title.toLowerCase().includes(term)) relevanceScore += 3;
        });
        
        // Check abstract for matches
        searchTerms.forEach(term => {
          if (paper.abstract.toLowerCase().includes(term)) relevanceScore += 2;
        });
        
        // Check keywords for matches - fixed to check if keywords exist before using
        if (paper.keywords && paper.keywords.length > 0) {
          paper.keywords.forEach(keyword => {
            searchTerms.forEach(term => {
              if (keyword.toLowerCase().includes(term)) relevanceScore += 4;
            });
          });
        }
        
        // Check for category matches - fixed to handle category as string
        if (paper.category) {
          searchTerms.forEach(term => {
            if (paper.category.toLowerCase().includes(term)) relevanceScore += 3;
          });
        }
        
        // Include papers with a relevance score above threshold
        return relevanceScore > 2;
      });
      
      // Sort by simulated relevance - in a real system this would be done by cosine similarity
      const sortedResults = [...searchResults].sort((a, b) => {
        // This is a simplistic simulation of semantic relevance
        const scoreA = searchTerms.reduce((score, term) => 
          score + (a.title.toLowerCase().includes(term) ? 3 : 0) +
          (a.abstract.toLowerCase().includes(term) ? 2 : 0), 0);
        
        const scoreB = searchTerms.reduce((score, term) => 
          score + (b.title.toLowerCase().includes(term) ? 3 : 0) +
          (b.abstract.toLowerCase().includes(term) ? 2 : 0), 0);
          
        return scoreB - scoreA;
      });
      
      setResults(sortedResults);
      
      toast({
        title: `${sortedResults.length} results found`,
        description: sortedResults.length > 0 ? 
          "Results are ordered by semantic relevance" : 
          "Try broadening your search terms",
      });
      
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search failed",
        description: "There was an error performing your search",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            AI-Powered Semantic Search
          </CardTitle>
          <CardDescription>
            Find research papers based on concepts and meaning, not just keywords
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input 
              placeholder="Search papers by concepts, methodologies, or research questions..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={performSearch} disabled={isSearching}>
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {isSearching && (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex gap-2 mt-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {!isSearching && results.length > 0 && (
        <div className="space-y-4">
          {results.map((paper) => (
            <Card key={paper.id} className="hover:border-primary/50 transition-colors">
              <CardContent className="p-4">
                <h3 className="font-medium hover:text-primary cursor-pointer">
                  {paper.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {paper.abstract}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <UserCheck className="h-3 w-3 mr-1" />
                    {paper.author.name}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {new Date(paper.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Award className="h-3 w-3 mr-1" />
                    {paper.citations} citations
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <BookOpen className="h-3 w-3 mr-1" />
                    {paper.category}
                  </div>
                </div>
                {paper.keywords && paper.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {paper.keywords.map((keyword, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {!isSearching && searchQuery && results.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
          <p className="text-sm text-muted-foreground mt-1">
            Try using different keywords or concepts
          </p>
        </div>
      )}
    </div>
  );
};

export default SemanticSearch;
