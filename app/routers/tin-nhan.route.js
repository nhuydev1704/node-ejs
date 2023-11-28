const router = require('express').Router();
const TinNhanCtrl = require('../controllers/tin-nhan.controller');
const { checkNotSession } = require('../utils');
const multer = require('multer'); // middleware để xử lý file
const path = require('path');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const code = new Date();

        if (!file || typeof file === 'string') {
            return cb(null, '');
        }

        const splitFileName = file.originalname.split('.');
        cb(null, file.fieldname + '_' + code + '.' + splitFileName[splitFileName.length - 1]);
    },
});
const upload = multer({ storage });

// const upload = multer({ storage: storage });

module.exports = (app) => {
    router.get('/', checkNotSession, TinNhanCtrl.index);
    router.get('/tao-tin', TinNhanCtrl.taoTin);
    router.post('/tao-tin', upload.single('file'), TinNhanCtrl.create);
    router.get('/chi-tiet', TinNhanCtrl.detail);
    router.get('/tin-gui', TinNhanCtrl.viewSend);
    router.post('/delete', TinNhanCtrl.delete);

    app.use('/tin-nhan', router);
};
