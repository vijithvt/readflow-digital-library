
import { BookType } from "@/types/book";

const STORAGE_KEY = "thinkpalm-reading-hub";

type StorageData = {
  books: BookType[];
  lastUpdated: string;
};

export function saveBooks(books: BookType[]): void {
  try {
    const storageData: StorageData = {
      books,
      lastUpdated: new Date().toISOString(),
    };
    
    // For small data, localStorage is fine
    // For larger data, we would need to use IndexedDB
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
  } catch (error) {
    console.error("Error saving books to storage:", error);
    
    // If we get a quota exceeded error, try to save without the actual file data
    // That can be reconstructed when the user opens the book again
    if (error instanceof DOMException && error.name === "QuotaExceededError") {
      const booksWithoutFiles = books.map((book) => {
        const { file, ...bookWithoutFile } = book;
        return bookWithoutFile;
      });
      
      const storageData: StorageData = {
        books: booksWithoutFiles as BookType[],
        lastUpdated: new Date().toISOString(),
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
    }
  }
}

export function loadBooks(): BookType[] {
  try {
    const storageData = localStorage.getItem(STORAGE_KEY);
    if (!storageData) return [];
    
    const parsedData: StorageData = JSON.parse(storageData);
    return parsedData.books;
  } catch (error) {
    console.error("Error loading books from storage:", error);
    return [];
  }
}

export function updateBook(bookId: string, updates: Partial<BookType>): BookType[] {
  const books = loadBooks();
  const updatedBooks = books.map((book) => {
    if (book.id === bookId) {
      return { ...book, ...updates };
    }
    return book;
  });
  
  saveBooks(updatedBooks);
  return updatedBooks;
}

export function deleteBook(bookId: string): BookType[] {
  const books = loadBooks();
  const updatedBooks = books.filter((book) => book.id !== bookId);
  
  saveBooks(updatedBooks);
  return updatedBooks;
}
