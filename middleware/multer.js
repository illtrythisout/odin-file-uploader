const multer = require('multer');

const storage = multer.memoryStorage();

const multerUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
});

module.exports = multerUpload;
