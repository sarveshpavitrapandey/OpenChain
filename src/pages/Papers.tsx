
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ResearchCard from "@/components/ResearchCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPublishedPapers } from "@/data/papers";
import { ResearchPaper } from "@/types";
import { Search, Filter } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const Papers = () => {
  const allPapers = getPublishedPapers();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPapers, setFilteredPapers] = useState<ResearchPaper[]>(allPapers);
  const [category, setCategory] = useState("all");
  
  // Extract unique categories
  const uniqueCategories = Array.from(
    new Set(allPapers.flatMap(paper => paper.category))
  );
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const filtered = allPapers.filter(paper => {
      const matchesSearch = paper.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           paper.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           paper.author.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = category === "all" || paper.category.includes(category);
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredPapers(filtered);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-brand-50 py-8">
          <div className="container px-4 md:px-6">
            <h1 className="text-3xl font-bold">Research Papers</h1>
            <p className="text-muted-foreground mt-2">
              Browse and discover the latest research published on our platform
            </p>
            
            <form onSubmit={handleSearch} className="mt-6 flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search papers by title, abstract, or author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    <SelectItem value="all">All Categories</SelectItem>
                    {uniqueCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button type="submit" className="gap-1">
                <Search className="h-4 w-4 mr-1" />
                Search
              </Button>
            </form>
          </div>
        </div>
        
        <div className="container px-4 md:px-6 py-8">
          <Tabs defaultValue="all" className="mb-8">
            <TabsList>
              <TabsTrigger value="all">All Papers</TabsTrigger>
              <TabsTrigger value="recent">Recently Published</TabsTrigger>
              <TabsTrigger value="cited">Most Cited</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              {filteredPapers.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">No papers found matching your criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                  {filteredPapers.map(paper => (
                    <ResearchCard key={paper.id} paper={paper} />
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="recent">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                {[...filteredPapers]
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map(paper => (
                    <ResearchCard key={paper.id} paper={paper} />
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="cited">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                {[...filteredPapers]
                  .sort((a, b) => b.citations - a.citations)
                  .map(paper => (
                    <ResearchCard key={paper.id} paper={paper} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Papers;
