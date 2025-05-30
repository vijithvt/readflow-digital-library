
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { BookType } from "@/types/book";
import DashboardStats from "@/components/DashboardStats";
import RecentBooks from "@/components/RecentBooks";
import BookUploader from "@/components/BookUploader";
import PdfReader from "@/components/PdfReader";
import { loadBooks, saveBooks, updateBook } from "@/lib/storage";
import { toast } from "sonner";

const Index = () => {
  const [books, setBooks] = useState<BookType[]>([]);
  const [currentBook, setCurrentBook] = useState<BookType | null>(null);
  
  useEffect(() => {
    const storedBooks = loadBooks();
    setBooks(storedBooks);
  }, []);

  const handleBookAdded = (newBook: BookType) => {
    const updatedBooks = [...books, newBook];
    setBooks(updatedBooks);
    saveBooks(updatedBooks);
  };

  const handleBookSelect = (book: BookType) => {
    setCurrentBook(book);
  };

  const handleBookmarkToggle = (bookId: string) => {
    const updatedBooks = books.map((book) => {
      if (book.id === bookId) {
        const isBookmarked = !book.isBookmarked;
        toast.success(
          isBookmarked ? "Book bookmarked" : "Bookmark removed"
        );
        return { ...book, isBookmarked };
      }
      return book;
    });
    setBooks(updatedBooks);
    saveBooks(updatedBooks);
    
    if (currentBook?.id === bookId) {
      setCurrentBook({
        ...currentBook,
        isBookmarked: !currentBook.isBookmarked,
      });
    }
  };

  const handleUpdateProgress = (bookId: string, currentPage: number) => {
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
        <h1 className="text-3xl font-bold text-center sm:text-left">Welcome to Your Reading Hub</h1>
        
        <DashboardStats books={books} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentBooks 
              books={books} 
              onBookSelect={handleBookSelect} 
              maxItems={10}
            />
          </div>
          
          <div>
            <BookUploader onBookAdded={handleBookAdded} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
