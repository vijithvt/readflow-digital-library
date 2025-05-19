
import { useState, useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";
import { BookType } from "@/types/book";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  ArrowLeft,
  BookmarkIcon,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { renderPdfPage } from "@/lib/pdfUtils";
import { toast } from "sonner";

type PdfReaderProps = {
  book: BookType;
  onClose: () => void;
  onBookmarkToggle: (bookId: string) => void;
  onUpdateProgress: (bookId: string, currentPage: number) => void;
};

const PdfReader = ({
  book,
  onClose,
  onBookmarkToggle,
  onUpdateProgress,
}: PdfReaderProps) => {
  const { theme } = useTheme();
  const [currentPage, setCurrentPage] = useState(book.currentPage || 1);
  const [totalPages, setTotalPages] = useState(book.totalPages || 0);
  const [zoom, setZoom] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(book.isBookmarked || false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pdfDocumentRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;
    const loadPdf = async () => {
      try {
        setIsLoading(true);
        const pdfjsLib = await import("pdfjs-dist");
        
        // Set worker source to CDN
        if (typeof window !== 'undefined') {
          pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
        }
        
        // Load document
        const PDFJS = await pdfjsLib.getDocument({ data: book.file }).promise;
        pdfDocumentRef.current = PDFJS;
        
        if (isMounted) {
          setTotalPages(PDFJS.numPages);
          renderPage(currentPage);
        }
      } catch (error) {
        console.error("Error loading PDF:", error);
        toast.error("Failed to load PDF");
      }
    };

    loadPdf();

    return () => {
      isMounted = false;
      if (pdfDocumentRef.current) {
        pdfDocumentRef.current.destroy().catch(console.error);
      }
    };
  }, [book.file]);

  useEffect(() => {
    renderPage(currentPage);
  }, [currentPage, zoom, theme]);

  const renderPage = async (pageNumber: number) => {
    if (!pdfDocumentRef.current || !canvasRef.current) return;
    
    try {
      setIsLoading(true);
      
      await renderPdfPage({
        pdfDocument: pdfDocumentRef.current,
        pageNumber,
        canvas: canvasRef.current,
        scale: zoom,
        theme,
      });
      
      onUpdateProgress(book.id, pageNumber);
      setIsLoading(false);
    } catch (error) {
      console.error("Error rendering page:", error);
      setIsLoading(false);
    }
  };

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handlePageChange = (newValue: number[]) => {
    goToPage(newValue[0]);
  };

  const handleBookmarkToggle = () => {
    setIsBookmarked(!isBookmarked);
    onBookmarkToggle(book.id);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Reader header */}
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={onClose}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="font-serif font-medium truncate max-w-md">
            {book.title}
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBookmarkToggle}
                >
                  <BookmarkIcon
                    className={`h-4 w-4 ${isBookmarked ? "text-primary fill-primary" : ""}`}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isBookmarked ? "Remove bookmark" : "Add bookmark"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
              disabled={zoom <= 0.5}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-xs w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoom(Math.min(3, zoom + 0.1))}
              disabled={zoom >= 3}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Reader content */}
      <div className="flex-1 overflow-auto flex flex-col items-center justify-center relative p-6 bg-gray-50 dark:bg-gray-900 sepia:bg-sepia-50">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <Progress value={30} className="w-24 animate-pulse" />
          </div>
        )}
        <div 
          className={`page-turn transition-transform shadow-lg rounded bg-white dark:bg-gray-800 sepia:bg-sepia-200 ${
            isLoading ? "opacity-50" : "opacity-100"
          }`}
          style={{
            transformOrigin: 'center left',
          }}
        >
          <canvas 
            ref={canvasRef} 
            className="max-h-[calc(100vh-200px)] rounded page-turn-content"
          />
        </div>
      </div>

      {/* Reader footer */}
      <div className="border-t p-4">
        <div className="flex items-center justify-between mb-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex-1 mx-4">
            <Slider
              value={[currentPage]}
              min={1}
              max={totalPages}
              step={1}
              onValueChange={handlePageChange}
              className="w-full"
            />
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-center text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>
      </div>
    </div>
  );
};

export default PdfReader;
