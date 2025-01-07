const multer = require('multer');
const path = require('path');
const fs = require('fs');


const productImageDir = path.join(__dirname, '../uploads/products');
const commentImageDir = path.join(__dirname, '../uploads/comments');

if (!fs.existsSync(productImageDir)) {
    fs.mkdirSync(productImageDir, { recursive: true });
}
if (!fs.existsSync(commentImageDir)) {
    fs.mkdirSync(commentImageDir, { recursive: true });
}

const productStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, productImageDir); 
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const commentStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, commentImageDir);
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const uploadProduct = multer({
    storage: productStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: function(req, file, cb) {
        if (file.mimetype.startsWith('image')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed!'), false);
        }
    }
});

const uploadComment = multer({
    storage: commentStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: function(req, file, cb) {
        if (file.mimetype.startsWith('image')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed!'), false);
        }
    }
});

module.exports = { uploadProduct, uploadComment };
