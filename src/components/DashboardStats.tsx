
import { useMemo } from "react";
import { BookType } from "@/types/book";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Clock,
  Calendar,
  BookmarkIcon,
} from "lucide-react";

type DashboardStatsProps = {
  books: BookType[];
};

export default function DashboardStats({ books }: DashboardStatsProps) {
  const stats = useMemo(() => {
    const totalBooks = books.length;
    const booksStarted = books.filter((book) => book.currentPage > 1).length;
    const booksCompleted = books.filter(
      (book) => book.totalPages && book.currentPage === book.totalPages
    ).length;
    const bookmarkedBooks = books.filter((book) => book.isBookmarked).length;
    
    // Calculate total pages read across all books
    const totalPagesRead = books.reduce((total, book) => {
      return total + (book.currentPage - 1);
    }, 0);

    // Get recently read books (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentlyReadBooks = books.filter((book) => {
      return new Date(book.lastOpened) >= sevenDaysAgo;
    }).length;

    return {
      totalBooks,
      booksStarted,
      booksCompleted,
      bookmarkedBooks,
      totalPagesRead,
      recentlyReadBooks,
    };
  }, [books]);

  const completionRate = useMemo(() => {
    if (stats.totalBooks === 0) return 0;
    return Math.round((stats.booksCompleted / stats.totalBooks) * 100);
  }, [stats]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Books</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalBooks}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.booksStarted} started, {stats.booksCompleted} completed
          </p>
          <Progress
            value={completionRate}
            className="h-2 mt-2"
            aria-label="Book completion rate"
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pages Read</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalPagesRead}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Total pages read across all books
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recently Read</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.recentlyReadBooks}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Books read in the last 7 days
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bookmarks</CardTitle>
          <BookmarkIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.bookmarkedBooks}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Bookmarked books for quick access
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
