
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { BookType } from "@/types/book";
import BookGrid from "@/components/BookGrid";
import BookUploader from "@/components/BookUploader";
import PdfReader from "@/components/PdfReader";
import { loadBooks, saveBooks } from "@/lib/storage";

const Library = () => {
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
        return { ...book, isBookmarked: !book.isBookmarked };
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Your Library</h1>
        </div>
        
        {books.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="space-y-4">
              <h2 className="text-xl font-medium">Welcome to your library</h2>
              <p className="text-muted-foreground">
                Your personal collection for all your PDF books. Upload your first PDF
                to get started with your reading journey.
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Upload any PDF file</li>
                <li>Read it with our built-in reader</li>
                <li>Track your reading progress</li>
                <li>Bookmark your favorite books</li>
              </ul>
            </div>
            <BookUploader onBookAdded={handleBookAdded} />
          </div>
        ) : (
          <>
            <BookGrid books={books} onBookSelect={handleBookSelect} />
            
            <div className="pt-8">
              <h2 className="text-xl font-medium mb-4">Add More Books</h2>
              <BookUploader onBookAdded={handleBookAdded} />
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Library;
