
import { useState, useMemo } from "react";
import { BookType } from "@/types/book";
import BookCard from "./BookCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SortOption = "title" | "author" | "lastOpened" | "addedDate";

type BookGridProps = {
  books: BookType[];
  onBookSelect: (book: BookType) => void;
};

export default function BookGrid({ books, onBookSelect }: BookGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("addedDate");

  const filteredBooks = useMemo(() => {
    if (!searchTerm.trim()) {
      return books;
    }

    const term = searchTerm.toLowerCase();
    return books.filter(
      (book) =>
        book.title.toLowerCase().includes(term) ||
        book.author.toLowerCase().includes(term) ||
        book.tags?.some((tag) => tag.toLowerCase().includes(term)) ||
        book.categories?.some((category) => category.toLowerCase().includes(term))
    );
  }, [books, searchTerm]);

  const sortedBooks = useMemo(() => {
    return [...filteredBooks].sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "author":
          return a.author.localeCompare(b.author);
        case "lastOpened":
          return new Date(b.lastOpened).getTime() - new Date(a.lastOpened).getTime();
        case "addedDate":
        default:
          return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
      }
    });
  }, [filteredBooks, sortBy]);

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium">Your library is empty</h3>
        <p className="text-muted-foreground mt-2">
          Upload some PDF books to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
        <Input
          placeholder="Search books, authors, or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground whitespace-nowrap">Sort by:</span>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="addedDate">Date Added</SelectItem>
              <SelectItem value="lastOpened">Last Read</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="author">Author</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {sortedBooks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No books found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {sortedBooks.map((book) => (
            <BookCard key={book.id} book={book} onClick={() => onBookSelect(book)} />
          ))}
        </div>
      )}
    </div>
  );
}
