require('dotenv/config');
const express = require('express');
// const methodOverride = require("method-override");
const { checkSession } = require('./app/utils');
// const path = require("path");
const cookieParser = require('cookie-parser');
const fs = require('fs');

// Tạo thư mục nếu nó không tồn tại
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}
const app = express();
const port = 3000;

app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', 'app/views');
app.use(express.static('app/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Cấu hình multer để lưu file vào thư mục 'uploads'
app.use('/uploads', express.static('uploads'));
app.get('/', checkSession, (req, res) => {
    res.render('index');
});
app.get('/500', (req, res) => {
    res.render('err');
});
app.get('/404', (req, res) => {
    res.render('404');
});

require('./app/routers')(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
