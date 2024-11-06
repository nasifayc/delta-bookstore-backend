import multer from "multer";
import path from "path";

const bookPdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/books/pdfs/");
  },
  filename: (req, file, cb) => {
    cb(null, `book-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const bookPdfFilter = (req, file, cb) => {
  const filetypes = /pdf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (extname) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed for book PDFs"), false);
  }
};

const uploadBookPdf = multer({
  storage: bookPdfStorage,
  fileFilter: bookPdfFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit for PDFs
}).single("pdf");

export default uploadBookPdf;
