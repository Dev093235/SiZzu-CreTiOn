const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

app.post('/upload', upload.array('photos', 50), (req, res) => {
  const files = req.files.map(file => `/uploads/${file.filename}`);
  res.json({ uploaded: files });
});

app.get('/gallery', (req, res) => {
  fs.readdir('./uploads', (err, files) => {
    if (err) return res.status(500).json({ message: 'Failed to read uploads' });
    const photos = files.map(file => `/uploads/${file}`);
    res.json({ photos });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
