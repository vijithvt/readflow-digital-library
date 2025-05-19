
import { toast } from "sonner";

type PdfMetadata = {
  title?: string;
  author?: string;
  coverUrl?: string;
  totalPages?: number;
  language?: string;
};

export async function extractPdfMetadata(
  fileData: ArrayBuffer
): Promise<PdfMetadata> {
  const { getDocument } = await import("pdfjs-dist");
  
  try {
    // Load PDF.js dynamically
    const pdfjsLib = await import("pdfjs-dist");
    
    // Set worker source - this approach doesn't directly import the worker file
    if (typeof window !== 'undefined') {
      // Use CDN worker or set it to null for automatic worker loading
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    }
    
    const loadingTask = getDocument({ data: fileData });
    const pdfDocument = await loadingTask.promise;
    
    const metadataResult = await pdfDocument.getMetadata().catch(() => ({}));
    // Handle the case where metadata might be empty
    const info = metadataResult.info || {};
    
    // Try to extract cover image from first page
    let coverUrl = "/placeholder.svg";
    try {
      const firstPage = await pdfDocument.getPage(1);
      const viewport = firstPage.getViewport({ scale: 0.5 });
      
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      const renderContext = {
        canvasContext: canvas.getContext("2d"),
        viewport: viewport,
      };
      
      await firstPage.render(renderContext).promise;
      coverUrl = canvas.toDataURL();
    } catch (error) {
      console.error("Error extracting cover:", error);
    }
    
    await pdfDocument.destroy();
    
    return {
      title: info.Title || "",
      author: info.Author || "",
      coverUrl,
      totalPages: pdfDocument.numPages,
      language: info.Language || "",
    };
  } catch (error) {
    console.error("Error in extractPdfMetadata:", error);
    toast.error("Failed to extract PDF metadata");
    return {};
  }
}

type RenderPdfPageProps = {
  pdfDocument: any;
  pageNumber: number;
  canvas: HTMLCanvasElement;
  scale: number;
  theme: string;
};

export async function renderPdfPage({
  pdfDocument,
  pageNumber,
  canvas,
  scale = 1,
  theme = "light",
}: RenderPdfPageProps): Promise<void> {
  try {
    const page = await pdfDocument.getPage(pageNumber);
    const viewport = page.getViewport({ scale });
    
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    const context = canvas.getContext("2d");
    
    // Apply rendering modifications based on theme
    if (theme === "dark" || theme === "sepia") {
      context!.filter = theme === "dark" 
        ? "invert(1) hue-rotate(180deg)"
        : "sepia(0.5) brightness(0.95)";
    }
    
    const renderContext = {
      canvasContext: context,
      viewport,
    };
    
    await page.render(renderContext).promise;
  } catch (error) {
    console.error("Error rendering PDF page:", error);
    throw error;
  }
}
