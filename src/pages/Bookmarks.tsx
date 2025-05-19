
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { BookType } from "@/types/book";
import BookGrid from "@/components/BookGrid";
import PdfReader from "@/components/PdfReader";
import { loadBooks, saveBooks } from "@/lib/storage";

const Bookmarks = () => {
  const [books, setBooks] = useState<BookType[]>([]);
  const [currentBook, setCurrentBook] = useState<BookType | null>(null);
  
  useEffect(() => {
    const storedBooks = loadBooks();
    const bookmarkedBooks = storedBooks.filter(book => book.isBookmarked);
    setBooks(bookmarkedBooks);
  }, []);

  const handleBookSelect = (book: BookType) => {
    setCurrentBook(book);
  };

  const handleBookmarkToggle = (bookId: string) => {
    // Load all books to update the bookmark in the main collection
    const allBooks = loadBooks();
    const updatedAllBooks = allBooks.map((book) => {
      if (book.id === bookId) {
        return { ...book, isBookmarked: !book.isBookmarked };
      }
      return book;
    });
    saveBooks(updatedAllBooks);
    
    // Update the bookmarked books list
    const bookmarkedBooks = updatedAllBooks.filter(book => book.isBookmarked);
    setBooks(bookmarkedBooks);
    
    if (currentBook?.id === bookId) {
      const isBookmarked = !currentBook.isBookmarked;
      if (!isBookmarked) {
        // If we unbookmarked the current book, close the reader
        setCurrentBook(null);
      } else {
        setCurrentBook({
          ...currentBook,
          isBookmarked: true,
        });
      }
    }
  };

  const handleUpdateProgress = (bookId: string, currentPage: number) => {
    // Update in all books collection
    const allBooks = loadBooks();
    const updatedAllBooks = allBooks.map((book) => {
      if (book.id === bookId) {
        return { 
          ...book, 
          currentPage,
          lastOpened: new Date().toISOString()
        };
      }
      return book;
    });
    saveBooks(updatedAllBooks);
    
    // Update in the bookmarked books list
    const updatedBooks = books.map((book) => {
      if (book.id === bookId) {
        return { 
          ...book, 
          currentPage,
          lastOpened: new Date().toISOString()
        };
      }
      return book;
    });
    setBooks(updatedBooks);
    
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
        <h1 className="text-3xl font-bold">Your Bookmarks</h1>
        
        {books.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-3">No bookmarked books yet</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              When reading a book, click the bookmark icon in the reader to add it to your bookmarks.
              Bookmarked books will appear here for quick access.
            </p>
          </div>
        ) : (
          <BookGrid books={books} onBookSelect={handleBookSelect} />
        )}
      </div>
    </Layout>
  );
};

export default Bookmarks;
