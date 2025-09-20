const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
let nextID = 1;
let Projects = [];

if(!fs.existsSync('Uploads')){
    fs.mkdirSync('Uploads');
};

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'Uploads/');
    }
});

const upload = multer({storage:storage});

router.get('/',(req,res)=>{
    res.json(Projects)
});
router.post('/',upload.single('myProject'),(req,res)=>{
    let id = nextID++;
    let name = req.body.name;
    let description = req.body.description;
    let filename = req.file ? req.file.filename:null;
    let rating = 0;
    let obj = {id,name,description,filename,rating};
    Projects[id]=obj;
    res.json({message:"added"})
});

s
