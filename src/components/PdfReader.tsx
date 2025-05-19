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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null);

  useEffect(() => {
    if (book.file instanceof ArrayBuffer) {
      const fileBytes = new Uint8Array(book.file);
      const newBuffer = new ArrayBuffer(fileBytes.byteLength);
      const newBytes = new Uint8Array(newBuffer);
      newBytes.set(fileBytes);
      setPdfData(newBuffer);
    } else {
      console.error("Book file is not an ArrayBuffer");
      toast.error("Invalid PDF file format");
    }
  }, [book.file]);

  const renderPage = async (pageNum: number) => {
    if (!pdfDocumentRef.current || !canvasRef.current) return;
    try {
      await renderPdfPage(
        pdfDocumentRef.current,
        canvasRef.current,
        pageNum,
        zoom,
        theme
      );
    } catch (err) {
      console.error("Error rendering page:", err);
      toast.error("Failed to render page");
    }
  };

  useEffect(() => {
    let isMounted = true;

    if (!pdfData) return;

    const loadPdf = async () => {
      try {
        setIsLoading(true);
        const pdfjsLib = await import("pdfjs-dist");

        if (typeof window !== "undefined") {
          pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
        }

        const PDFJS = await pdfjsLib.getDocument({ data: pdfData }).promise;

        if (pdfDocumentRef.current) {
          await pdfDocumentRef.current.destroy().catch(console.error);
        }

        pdfDocumentRef.current = PDFJS;

        if (isMounted) {
          setTotalPages(PDFJS.numPages);
          await renderPage(currentPage);
        }
      } catch (error) {
        console.error("Error loading PDF:", error);
        toast.error("Failed to load PDF");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadPdf();

    return () => {
      isMounted = false;
      if (pdfDocumentRef.current) {
        pdfDocumentRef.current.destroy().catch(console.error);
      }
    };
  }, [pdfData]);

  useEffect(() => {
    if (pdfDocumentRef.current) {
      renderPage(currentPage);
      onUpdateProgress(book.id, currentPage);
    }
  }, [currentPage, zoom]);

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const toggleBookmark = () => {
    setIsBookmarked((prev) => !prev);
    onBookmarkToggle(book.id);
  };

  return (
    <div className="w-full h-full flex flex-col bg-background text-foreground">
      <div className="flex justify-between items-center p-4 border-b">
        <Button variant="ghost" onClick={onClose}>
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        <div className="flex items-center space-x-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" onClick={goToPrevPage} disabled={currentPage === 1}>
                  <ChevronLeft />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Previous Page</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" onClick={goToNextPage} disabled={currentPage === totalPages}>
                  <ChevronRight />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Next Page</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" onClick={() => setZoom((z) => Math.min(z + 0.1, 3))}>
                  <ZoomIn />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom In</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" onClick={() => setZoom((z) => Math.max(z - 0.1, 0.5))}>
                  <ZoomOut />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom Out</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" onClick={toggleBookmark}>
                  <BookmarkIcon
                    className={isBookmarked ? "fill-primary text-primary" : ""}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center overflow-auto bg-muted p-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading PDF...</p>
        ) : (
          <canvas ref={canvasRef} />
        )}
      </div>

      <div className="p-4 space-y-2">
        <Slider
          min={1}
          max={totalPages}
          value={[currentPage]}
          onValueChange={(val) => setCurrentPage(val[0])}
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <span>{Math.round((currentPage / totalPages) * 100)}% read</span>
        </div>
        <Progress value={(currentPage / totalPages) * 100} />
      </div>
    </div>
  );
};

export default PdfReader;
