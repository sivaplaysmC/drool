import multer from 'multer';
import path from 'path';
import fs from 'fs';


const ensureDocumentsFolder = () => {
  const dir = path.join(process.cwd(), 'documents'); 
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true }); 
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureDocumentsFolder(); 
    cb(null, 'documents/'); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname); 
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`); 
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, JPG, and PNG are allowed.'));
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, 
  fileFilter,
});
