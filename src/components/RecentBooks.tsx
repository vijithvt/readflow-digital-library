
import { BookType } from "@/types/book";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

type RecentBooksProps = {
  books: BookType[];
  onBookSelect: (book: BookType) => void;
  maxItems?: number;
};

export default function RecentBooks({
  books,
  onBookSelect,
  maxItems = 5,
}: RecentBooksProps) {
  // Sort books by lastOpened date (most recent first)
  const sortedBooks = [...books]
    .sort((a, b) => new Date(b.lastOpened).getTime() - new Date(a.lastOpened).getTime())
    .slice(0, maxItems);

  if (books.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Books</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Books you read will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Books</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {sortedBooks.map((book) => {
            const progressPercent =
              book.totalPages > 0
                ? Math.round((book.currentPage / book.totalPages) * 100)
                : 0;

            return (
              <li
                key={book.id}
                className="flex items-center gap-3 cursor-pointer hover:bg-accent/10 p-2 rounded-md transition-colors"
                onClick={() => onBookSelect(book)}
              >
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="h-12 w-9 object-cover rounded shadow"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">{book.title}</h3>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatDate(book.lastOpened)}</span>
                    <span>{progressPercent}% read</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
