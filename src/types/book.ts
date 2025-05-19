
export type BookType = {
  id: string;
  title: string;
  author: string;
  fileName: string;
  fileSizeBytes: number;
  lastOpened: string;
  addedDate: string;
  file?: ArrayBuffer;
  coverUrl: string;
  totalPages: number;
  currentPage: number;
  categories: string[];
  tags: string[];
  language: string;
  isBookmarked?: boolean;
};
