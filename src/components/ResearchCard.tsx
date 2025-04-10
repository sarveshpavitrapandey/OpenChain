
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResearchPaper } from "@/types";
import { FileText, User, Calendar, Eye, BookOpen, Coins } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

interface ResearchCardProps {
  paper: ResearchPaper;
}

const ResearchCard = ({ paper }: ResearchCardProps) => {
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

  return (
    <Card className="h-full transition-shadow hover:shadow-md overflow-hidden flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start mb-2">
          {getStatusBadge()}
          <Badge variant="outline" className="flex items-center gap-1">
            <Coins className="h-3 w-3" />
            {paper.tokens} OCT
          </Badge>
        </div>
        <Link to={`/paper/${paper.id}`}>
          <CardTitle className="text-xl hover:text-brand-600 transition-colors line-clamp-2">
            {paper.title}
          </CardTitle>
        </Link>
        <div className="flex items-center text-xs text-muted-foreground mt-2 gap-3">
          <div className="flex items-center">
            <User className="h-3 w-3 mr-1" />
            {paper.author.name}
          </div>
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDistanceToNow(new Date(paper.date), { addSuffix: true })}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <p className="text-muted-foreground text-sm line-clamp-3">{paper.abstract}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          <Badge variant="outline" className="text-xs">
            {paper.category}
          </Badge>
          {paper.keywords?.map((keyword) => (
            <Badge key={keyword} variant="outline" className="text-xs bg-muted/50">
              {keyword}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="flex items-center">
            <Eye className="h-3 w-3 mr-1" />
            {paper.views}
          </span>
          <span className="flex items-center">
            <BookOpen className="h-3 w-3 mr-1" />
            {paper.citations} citations
          </span>
        </div>
        {paper.doi && (
          <span className="text-xs font-mono opacity-70">{paper.doi}</span>
        )}
      </CardFooter>
    </Card>
  );
};

export default ResearchCard;
