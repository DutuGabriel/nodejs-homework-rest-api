const multer = require("multer");
const path = require("path");

const tempDir = path.join(__dirname, "../tmp");

const multerConfig = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({
  storage: multerConfig,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

module.exports = upload;
