
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { BookType } from "@/types/book";
import { Input } from "@/components/ui/input";
import BookGrid from "@/components/BookGrid";
import PdfReader from "@/components/PdfReader";
import { loadBooks, saveBooks } from "@/lib/storage";
import { Search as SearchIcon } from "lucide-react";

const Search = () => {
  const [query, setQuery] = useState("");
  const [allBooks, setAllBooks] = useState<BookType[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<BookType[]>([]);
  const [currentBook, setCurrentBook] = useState<BookType | null>(null);
  
  useEffect(() => {
    const storedBooks = loadBooks();
    setAllBooks(storedBooks);
  }, []);

  useEffect(() => {
    if (query.trim() === "") {
      setFilteredBooks([]);
      return;
    }

    const searchTerms = query.toLowerCase().split(" ");
    
    const filtered = allBooks.filter(book => {
      const searchableText = [
        book.title,
        book.author,
        ...(book.tags || []),
        ...(book.categories || []),
        book.language,
      ].join(" ").toLowerCase();
      
      return searchTerms.every(term => searchableText.includes(term));
    });
    
    setFilteredBooks(filtered);
  }, [query, allBooks]);

  const handleBookSelect = (book: BookType) => {
    setCurrentBook(book);
  };

  const handleBookmarkToggle = (bookId: string) => {
    const updatedBooks = allBooks.map((book) => {
      if (book.id === bookId) {
        return { ...book, isBookmarked: !book.isBookmarked };
      }
      return book;
    });
    setAllBooks(updatedBooks);
    saveBooks(updatedBooks);
    
    if (currentBook?.id === bookId) {
      setCurrentBook({
        ...currentBook,
        isBookmarked: !currentBook.isBookmarked,
      });
    }
  };

  const handleUpdateProgress = (bookId: string, currentPage: number) => {
    const updatedBooks = allBooks.map((book) => {
      if (book.id === bookId) {
        return { 
          ...book, 
          currentPage,
          lastOpened: new Date().toISOString()
        };
      }
      return book;
    });
    setAllBooks(updatedBooks);
    saveBooks(updatedBooks);
    
    if (currentBook?.id === bookId) {
      setCurrentBook({
        ...currentBook,
        currentPage,
        lastOpened: new Date().toISOString()
      });
    }
  };

  if (currentBook) {
    return (
      <PdfReader
        book={currentBook}
        onClose={() => setCurrentBook(null)}
        onBookmarkToggle={handleBookmarkToggle}
        onUpdateProgress={handleUpdateProgress}
      />
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Search Your Library</h1>
        
        <div className="relative max-w-2xl mx-auto">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for books, authors, tags..."
            className="pl-10 text-lg py-6"
          />
        </div>
        
        <div className="pt-4">
          {query.trim() === "" ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Enter search terms to find books in your library
              </p>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-medium mb-3">No books found</h2>
              <p className="text-muted-foreground">
                No books matching "{query}" were found in your library
              </p>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground mb-4">
                Found {filteredBooks.length} {filteredBooks.length === 1 ? "book" : "books"} matching "{query}"
              </p>
              <BookGrid books={filteredBooks} onBookSelect={handleBookSelect} />
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Search;
