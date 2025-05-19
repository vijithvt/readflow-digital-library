
import { BookType } from "@/types/book";
import { BookmarkIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatFileSize, formatDate } from "@/lib/utils";

type BookCardProps = {
  book: BookType;
  onClick: () => void;
};

export default function BookCard({ book, onClick }: BookCardProps) {
  const { title, author, coverUrl, currentPage, totalPages, fileSizeBytes, lastOpened } = book;
  
  const progressPercentage = totalPages ? Math.round((currentPage / totalPages) * 100) : 0;
  
  return (
    <Card 
      className="overflow-hidden transition-transform book-shadow cursor-pointer h-full flex flex-col" 
      onClick={onClick}
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img 
          src={coverUrl} 
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        {progressPercentage > 0 && progressPercentage < 100 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
            <div 
              className="h-full bg-primary" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        )}
        {progressPercentage === 100 && (
          <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
            Completed
          </div>
        )}
        {book.isBookmarked && (
          <div className="absolute top-2 right-2">
            <BookmarkIcon className="h-5 w-5 text-primary" fill="currentColor" />
          </div>
        )}
      </div>
      <CardContent className="flex-grow flex flex-col justify-between p-4">
        <div>
          <h3 className="font-serif font-bold text-sm line-clamp-2 mb-1">{title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-1">{author}</p>
        </div>
        <div className="text-xs text-muted-foreground mt-4 space-y-1">
          {progressPercentage > 0 && (
            <p className="flex justify-between">
              <span>Progress</span>
              <span>{progressPercentage}%</span>
            </p>
          )}
          <p className="flex justify-between">
            <span>Size</span>
            <span>{formatFileSize(fileSizeBytes)}</span>
          </p>
          <p className="flex justify-between">
            <span>Last read</span>
            <span>{formatDate(lastOpened)}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
