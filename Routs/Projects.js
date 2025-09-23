const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
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
    res.json({message:"added",project : obj})
});
router.delete('/:id',(req,res)=>{
    let id = Number(req.params.id);
    if(isNaN(id)){
        return res.json({message : "Not a Number !"})
    }
    let project = Projects[id];
    if(!project){
        res.status(400).json({message:" not exsist "});
    }
    Projects[id]=null;
    if(project.filename){
        if(fs.existsSync(path.join('Uploads',project.filename))){
            fs.unlinkSync(path.join('Uploads',project.filename));
        }
    }
    res.status(200).json({message : "deleted "});
})

router.get('/:id',(req,res)=>{
    let id = Number(req.params.id);
    if(isNaN(id)){
        return res.json({message : "Not a Number !"})
    }
    let project = Projects[id];
    if(!project){
        res.status(400).json({message : "not exsist"});
    }
    res.status(200).json(project);
});

router.patch('/:id',upload.single('myProject'),(req,res)=>{
    
    let id = Number(req.params.id);
    if(isNaN(id)){
        return res.json({message : "Not a Number !"})
    }

    let project = Projects[id];
    if(!project){
        res.status(400).json({message :"Not exsist !"});
    };
    
    let OldFileName = project.filename;
    let NewFileName = req.file ? req.file.filename : null ;
    if(OldFileName && NewFileName && NewFileName !== OldFileName){
        if(fs.existsSync(path.join('Uploads',OldFileName))){
            fs.unlinkSync(path.join('Uploads',OldFileName));
        }
        project.filename = NewFileName;
    }
    let name = req.body.name;
    let description = req.body.description;
    if(name) project.name = name;
    if(description) project.description = description;

    if(req.body.rating) project.rating = req.body.rating;
    res.json({message : " Updated "})
});



module.exports = router;
