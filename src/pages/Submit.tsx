
import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, BookOpen, FileText, Info, Paperclip, Plus, Upload, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";

const Submit = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryInput, setCategoryInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // File state management
  const [paperFile, setPaperFile] = useState<File | null>(null);
  const [supplementaryFiles, setSupplementaryFiles] = useState<File[]>([]);
  
  // Refs for file input elements
  const paperFileInputRef = useRef<HTMLInputElement>(null);
  const supplementaryFileInputRef = useRef<HTMLInputElement>(null);
  
  const handleAddCategory = () => {
    if (categoryInput && !categories.includes(categoryInput) && categories.length < 5) {
      setCategories([...categories, categoryInput]);
      setCategoryInput("");
    }
  };
  
  const handleRemoveCategory = (cat: string) => {
    setCategories(categories.filter(c => c !== cat));
  };
  
  // Handle paper file selection
  const handlePaperFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // Check if file is PDF
      if (file.type !== 'application/pdf') {
        toast({
          title: "Invalid File Format",
          description: "Please upload your paper in PDF format.",
          variant: "destructive"
        });
        return;
      }
      
      // Check if file size is within limits (20MB = 20 * 1024 * 1024 bytes)
      if (file.size > 20 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Maximum file size is 20MB.",
          variant: "destructive"
        });
        return;
      }
      
      setPaperFile(file);
      toast({
        title: "Paper Selected",
        description: `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`
      });
    }
  };
  
  // Handle supplementary files selection
  const handleSupplementaryFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Convert FileList to array and check each file
      const newFiles = Array.from(e.target.files);
      const validFiles = newFiles.filter(file => file.size <= 20 * 1024 * 1024);
      
      if (validFiles.length !== newFiles.length) {
        toast({
          title: "Some Files Skipped",
          description: "Files larger than 20MB were not added.",
          variant: "destructive"
        });
      }
      
      setSupplementaryFiles(prev => [...prev, ...validFiles]);
      toast({
        title: "Files Added",
        description: `${validFiles.length} file(s) added successfully.`
      });
    }
  };
  
  // Remove a supplementary file
  const removeSupplementaryFile = (index: number) => {
    setSupplementaryFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  // Trigger file input click
  const triggerPaperFileInput = () => {
    if (paperFileInputRef.current) {
      paperFileInputRef.current.click();
    }
  };
  
  const triggerSupplementaryFileInput = () => {
    if (supplementaryFileInputRef.current) {
      supplementaryFileInputRef.current.click();
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !abstract || categories.length === 0 || !paperFile) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and upload your paper.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call with a delay
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Submission Successful",
        description: "Your paper has been submitted for review.",
      });
      navigate("/profile");
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-brand-50 py-8">
          <div className="container px-4 md:px-6">
            <h1 className="text-3xl font-bold">Submit Research Paper</h1>
            <p className="text-muted-foreground mt-2">
              Share your research with the scientific community
            </p>
          </div>
        </div>
        
        <div className="container px-4 md:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit}>
                <Card>
                  <CardHeader>
                    <CardTitle>Paper Information</CardTitle>
                    <CardDescription>
                      Enter the details of your research paper
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Paper Title *</Label>
                      <Input 
                        id="title" 
                        placeholder="Enter the title of your paper"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="abstract">Abstract *</Label>
                      <Textarea 
                        id="abstract" 
                        placeholder="Provide a concise summary of your research"
                        className="min-h-[150px]"
                        value={abstract}
                        onChange={(e) => setAbstract(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Categories *</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {categories.map(cat => (
                          <Badge key={cat} className="flex items-center gap-1 py-1.5">
                            {cat}
                            <button
                              type="button"
                              onClick={() => handleRemoveCategory(cat)}
                              className="ml-1 hover:text-destructive transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                        {categories.length === 0 && (
                          <div className="text-sm text-muted-foreground">
                            Add up to 5 categories relevant to your research
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a category"
                          value={categoryInput}
                          onChange={(e) => setCategoryInput(e.target.value)}
                          disabled={categories.length >= 5}
                        />
                        <Button 
                          type="button"
                          variant="outline"
                          onClick={handleAddCategory}
                          disabled={!categoryInput || categories.includes(categoryInput) || categories.length >= 5}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Paper Upload Section - Now Functional */}
                    <div className="space-y-2">
                      <Label htmlFor="paper">Full Paper * (PDF)</Label>
                      <input
                        type="file"
                        id="paper-file"
                        ref={paperFileInputRef}
                        onChange={handlePaperFileChange}
                        accept=".pdf"
                        className="hidden"
                      />
                      <div 
                        className={`border-2 border-dashed rounded-lg p-8 text-center ${paperFile ? 'bg-brand-50/30' : ''}`}
                        onClick={triggerPaperFileInput}
                      >
                        {!paperFile ? (
                          <div className="flex flex-col items-center justify-center space-y-2 cursor-pointer">
                            <div className="p-3 bg-brand-50 rounded-full">
                              <FileText className="h-8 w-8 text-brand-600" />
                            </div>
                            <h3 className="font-medium">Upload your paper (PDF)</h3>
                            <p className="text-sm text-muted-foreground pb-4">
                              Drag and drop or click to browse
                            </p>
                            <Button type="button" onClick={(e) => {
                              e.stopPropagation();
                              triggerPaperFileInput();
                            }}>
                              <Upload className="h-4 w-4 mr-2" />
                              Select File
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <div className="p-3 bg-brand-50 rounded-full">
                              <FileText className="h-8 w-8 text-brand-600" />
                            </div>
                            <h3 className="font-medium">{paperFile.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {(paperFile.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                            <div className="flex gap-2">
                              <Button 
                                type="button" 
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  triggerPaperFileInput();
                                }}
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                Change File
                              </Button>
                              <Button 
                                type="button" 
                                variant="destructive" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPaperFile(null);
                                }}
                              >
                                <X className="h-4 w-4 mr-2" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Supplementary Materials - Now Functional */}
                    <div className="space-y-2">
                      <Label htmlFor="supplementary">Supplementary Materials (optional)</Label>
                      <input
                        type="file"
                        id="supplementary-files"
                        ref={supplementaryFileInputRef}
                        onChange={handleSupplementaryFilesChange}
                        multiple
                        className="hidden"
                      />
                      <div className="border-2 border-dashed rounded-lg p-6 text-center">
                        {supplementaryFiles.length === 0 ? (
                          <>
                            <p className="text-sm text-muted-foreground">
                              Upload any supplementary materials, data sets, or code repositories
                            </p>
                            <Button 
                              type="button" 
                              variant="outline" 
                              className="mt-4"
                              onClick={() => triggerSupplementaryFileInput()}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Add Files
                            </Button>
                          </>
                        ) : (
                          <>
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <h4 className="font-medium">Uploaded Files ({supplementaryFiles.length})</h4>
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => triggerSupplementaryFileInput()}
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add More
                                </Button>
                              </div>
                              <div className="space-y-2 max-h-48 overflow-y-auto">
                                {supplementaryFiles.map((file, index) => (
                                  <div 
                                    key={index} 
                                    className="flex justify-between items-center p-2 bg-muted/50 rounded border text-sm"
                                  >
                                    <div className="flex items-center gap-2 overflow-hidden">
                                      <Paperclip className="h-4 w-4 shrink-0" />
                                      <span className="truncate">{file.name}</span>
                                      <span className="text-xs text-muted-foreground shrink-0">
                                        ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                                      </span>
                                    </div>
                                    <Button 
                                      type="button" 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => removeSupplementaryFile(index)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Important</AlertTitle>
                      <AlertDescription>
                        By submitting, you confirm that this is your original work and 
                        agree to our terms of publication.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:space-x-2 sm:space-y-0">
                    <Button variant="outline" type="button" onClick={() => navigate("/papers")}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Paper"}
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </div>
            
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Submission Guidelines</CardTitle>
                  <CardDescription>
                    Requirements for research paper submissions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium flex items-center mb-2">
                      <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                      Format Requirements
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• PDF format only</li>
                      <li>• Max file size: 20MB</li>
                      <li>• Include all figures and tables</li>
                      <li>• References in standard format</li>
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium flex items-center mb-2">
                      <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                      Peer Review Process
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      All submissions undergo a transparent peer review process.
                      You can track the status of your submission in your profile dashboard.
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Token Rewards</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      You'll receive OCT tokens when:
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Paper Published</span>
                        <Badge variant="outline">300+ OCT</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Each Citation</span>
                        <Badge variant="outline">25 OCT</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Reader Rewards</span>
                        <Badge variant="outline">5+ OCT</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                  <CardDescription>
                    Resources to assist with your submission
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    Submission Guidelines
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    FAQ
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Submit;
