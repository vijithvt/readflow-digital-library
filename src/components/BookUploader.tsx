
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookType } from "@/types/book";
import { extractPdfMetadata } from "@/lib/pdfUtils";
import { BookOpen } from "lucide-react";

type BookUploaderProps = {
  onBookAdded: (book: BookType) => void;
};

export default function BookUploader({ onBookAdded }: BookUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const processFiles = async (files: FileList) => {
    setIsProcessing(true);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (file.type !== "application/pdf") {
        toast.error(`${file.name} is not a PDF file`);
        continue;
      }

      try {
        // Read the file
        const fileData = await readFileAsArrayBuffer(file);
        
        // Extract metadata
        const metadata = await extractPdfMetadata(fileData);
        
        // Create a book object
        const book: BookType = {
          id: Date.now().toString() + i,
          title: metadata.title || file.name.replace('.pdf', ''),
          author: metadata.author || 'Unknown Author',
          fileName: file.name,
          fileSizeBytes: file.size,
          lastOpened: new Date().toISOString(),
          addedDate: new Date().toISOString(),
          file: fileData,
          coverUrl: metadata.coverUrl || '/placeholder.svg',
          totalPages: metadata.totalPages || 0,
          currentPage: 1,
          categories: [],
          tags: [],
          language: metadata.language || 'Unknown',
        };
        
        onBookAdded(book);
        toast.success(`Added: ${book.title}`);
      } catch (error) {
        console.error("Error processing PDF:", error);
        toast.error(`Failed to process ${file.name}`);
      }
    }
    
    setIsProcessing(false);
  };

  const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as ArrayBuffer);
        } else {
          reject(new Error("Failed to read file"));
        }
      };
      reader.onerror = (e) => reject(e);
      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <Card
      className={`p-8 text-center border-2 border-dashed transition-all duration-300 ${
        isDragging ? "border-primary bg-primary/5" : "border-border"
      } ${isProcessing ? "opacity-70" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="application/pdf"
        className="hidden"
        multiple
      />
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="rounded-full bg-primary/10 p-3">
          <BookOpen className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-medium">Upload PDF Books</h3>
        <p className="text-muted-foreground">
          {isProcessing ? "Processing your books..." : "Drag & drop PDF files here, or click to select"}
        </p>
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
        >
          Select Files
        </Button>
      </div>
    </Card>
  );
}
