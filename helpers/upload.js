const multer = require('multer');

const { Limit } = require('./constants');

require('dotenv').config();

const UPLOAD_DIR = process.env.UPLOAD_DIR;

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (_req, file, cb) {
    cb(null, `${Date.now().toString()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: Limit.MAX_SIZE_AVATARS_2MB },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.includes('image')) {
      cb(null, true);
      return;
    }
    cb(null, false);
  },
});

module.exports = upload;
