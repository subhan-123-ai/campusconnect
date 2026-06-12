const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '../uploads/resources');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${unique}${ext}`);
  },
});

const allowedMimes = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
];

const fileFilter = (_req, file, cb) => {
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and image files (JPG, PNG, WEBP, GIF) are allowed'), false);
  }
};

const uploadResource = multer({
  storage,
  fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 },
});

module.exports = { uploadResource };
