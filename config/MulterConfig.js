// const multer = require("multer");
// const path = require("path");
// const { v4: uuidv4 } = require("uuid");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public');
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const uniqueName = `${uuidv4()}-${Date.now()}${ext}`;
//     cb(null, uniqueName);
//   },
// });

// const upload = multer({ storage });

// module.exports = upload;

const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/var/data');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = `${uuidv4()}-${Date.now()}${ext}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

module.exports = upload;
