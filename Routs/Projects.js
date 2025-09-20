const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');

if(!fs.existsSync('Uploads')){
    fs.mkdirSync('Uploads');
};

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'Uploads/');
    }
});
