
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Coins, Eye, BookOpen, Star, User, Building, Link, Pencil } from "lucide-react";
import { getCurrentUser } from "@/data/users";
import { papers, reviews } from "@/data/papers";
import ResearchCard from "@/components/ResearchCard";
import { Link as RouterLink } from "react-router-dom";

const Profile = () => {
  const user = getCurrentUser();
  const [activeTab, setActiveTab] = useState("overview");
  
  const userPapers = papers.filter(paper => user.papers.includes(paper.id));
  const userReviews = reviews.filter(review => user.reviews.includes(review.id));
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-muted/30">
        <div className="container px-4 md:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit Profile</span>
                    </Button>
                  </div>
                  <CardTitle className="mt-2">{user.name}</CardTitle>
                  <CardDescription>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{user.institution}</span>
                    </div>
                    {user.wallet && (
                      <div className="flex items-start">
                        <Link className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                        <span className="text-xs font-mono break-all opacity-70">{user.wallet}</span>
                      </div>
                    )}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <p className="text-sm">{user.bio}</p>
                </CardContent>
                <CardFooter className="pt-2">
                  <div className="w-full">
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="py-4 px-4">
                          <div className="flex items-center justify-between">
                            <CardDescription className="text-xs">Papers</CardDescription>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </CardHeader>
                        <CardContent className="py-0 px-4 -mt-2">
                          <p className="text-2xl font-bold">{user.papers.length}</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="py-4 px-4">
                          <div className="flex items-center justify-between">
                            <CardDescription className="text-xs">Reviews</CardDescription>
                            <Star className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </CardHeader>
                        <CardContent className="py-0 px-4 -mt-2">
                          <p className="text-2xl font-bold">{user.reviews.length}</p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Card className="mt-4">
                      <CardHeader className="py-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Token Balance</CardTitle>
                          <Coins className="h-5 w-5 text-brand-600" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-3xl font-bold">{user.tokens}</p>
                            <p className="text-sm text-muted-foreground">OCT Tokens</p>
                          </div>
                          <Button>Transfer</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>My Network</CardTitle>
                  <CardDescription>Your scientific connections</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="https://i.pravatar.cc/150?img=2" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">Dr. James Davidson</p>
                          <p className="text-xs text-muted-foreground">Collaborator</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">3 papers</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="https://i.pravatar.cc/150?img=4" />
                          <AvatarFallback>AT</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">Prof. Amanda Torres</p>
                          <p className="text-xs text-muted-foreground">Co-author</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">1 paper</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="https://i.pravatar.cc/150?img=6" />
                          <AvatarFallback>RL</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">Dr. Robert Lee</p>
                          <p className="text-xs text-muted-foreground">Reviewer</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">2 reviews</Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View All Connections</Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 mb-8">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="papers">My Papers</TabsTrigger>
                  <TabsTrigger value="reviews">My Reviews</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-2xl font-bold">1,243</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Citations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-2xl font-bold">17</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Tokens Earned</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center">
                          <Coins className="h-4 w-4 mr-2 text-brand-600" />
                          <span className="text-2xl font-bold">{user.tokens} OCT</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="space-y-8">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium">Recent Papers</h3>
                        <Button variant="ghost" size="sm" onClick={() => setActiveTab("papers")}>
                          View All
                        </Button>
                      </div>
                      
                      {userPapers.length > 0 ? (
                        <div className="space-y-4">
                          {userPapers.slice(0, 2).map(paper => (
                            <ResearchCard key={paper.id} paper={paper} />
                          ))}
                        </div>
                      ) : (
                        <Card className="p-8 text-center">
                          <div className="flex flex-col items-center">
                            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                            <h4 className="font-medium text-lg mb-2">No Papers Yet</h4>
                            <p className="text-muted-foreground mb-6">
                              You haven't published any research papers yet.
                            </p>
                            <RouterLink to="/submit">
                              <Button>Submit a Paper</Button>
                            </RouterLink>
                          </div>
                        </Card>
                      )}
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium">Recent Reviews</h3>
                        <Button variant="ghost" size="sm" onClick={() => setActiveTab("reviews")}>
                          View All
                        </Button>
                      </div>
                      
                      {userReviews.length > 0 ? (
                        <div className="space-y-4">
                          {userReviews.filter(r => r.status === "completed").slice(0, 2).map(review => (
                            <Card key={review.id}>
                              <CardHeader>
                                <div className="flex justify-between items-start">
                                  <div>
                                    <CardTitle className="text-base">
                                      Review for: {papers.find(p => p.reviews.some(r => r.id === review.id))?.title}
                                    </CardTitle>
                                    <CardDescription>
                                      {new Date(review.date).toLocaleDateString()}
                                    </CardDescription>
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
                                <p className="text-sm line-clamp-2">{review.content}</p>
                              </CardContent>
                              <CardFooter>
                                <Badge variant="outline" className="ml-auto">
                                  {review.tokens} OCT earned
                                </Badge>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <Card className="p-8 text-center">
                          <div className="flex flex-col items-center">
                            <Star className="h-12 w-12 text-muted-foreground mb-4" />
                            <h4 className="font-medium text-lg mb-2">No Reviews Yet</h4>
                            <p className="text-muted-foreground mb-6">
                              You haven't completed any peer reviews yet.
                            </p>
                            <Button>Find Papers to Review</Button>
                          </div>
                        </Card>
                      )}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="papers">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>My Research Papers</CardTitle>
                          <CardDescription>Papers you have published or submitted</CardDescription>
                        </div>
                        <RouterLink to="/submit">
                          <Button>Submit New Paper</Button>
                        </RouterLink>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {userPapers.length > 0 ? (
                        <div className="space-y-6">
                          {userPapers.map(paper => (
                            <ResearchCard key={paper.id} paper={paper} />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-medium mb-2">No Papers Found</h3>
                          <p className="text-muted-foreground mb-6">
                            You haven't published any research papers yet.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="reviews">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>My Reviews</CardTitle>
                          <CardDescription>Peer reviews you've completed</CardDescription>
                        </div>
                        <Button variant="outline">Find Papers to Review</Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {userReviews.filter(r => r.status === "completed").length > 0 ? (
                        <div className="space-y-6">
                          {userReviews.filter(r => r.status === "completed").map(review => {
                            const relatedPaper = papers.find(p => p.reviews.some(r => r.id === review.id));
                            return (
                              <Card key={review.id}>
                                <CardHeader>
                                  <RouterLink to={`/paper/${relatedPaper?.id}`}>
                                    <CardTitle className="text-base hover:text-brand-600 transition-colors">
                                      {relatedPaper?.title}
                                    </CardTitle>
                                  </RouterLink>
                                  <div className="flex items-center justify-between mt-2">
                                    <CardDescription>
                                      {new Date(review.date).toLocaleDateString()}
                                    </CardDescription>
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
                                  <ScrollArea className="h-24">
                                    <p className="text-sm">{review.content}</p>
                                  </ScrollArea>
                                </CardContent>
                                <CardFooter>
                                  <div className="ml-auto flex items-center gap-2">
                                    <Badge variant="outline">{review.tokens} OCT earned</Badge>
                                  </div>
                                </CardFooter>
                              </Card>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-medium mb-2">No Reviews Found</h3>
                          <p className="text-muted-foreground mb-6">
                            You haven't completed any peer reviews yet.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
