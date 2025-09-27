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
//פה זה השליפה של כל פרויקטים אבל הוא שונה מהרגיל 
//רציתי להראות כאן את התצוגת ממוצע של הכוכבים אז הכנסתי את זה 
//לGET
//בשביל להראות אם כמה אנשים מצביעים 3 כוכבים וכמה 5 זה יתן ממומצע של 4 למשל 
//כן השתמשתי בCHATGPT כי לא ידעתי את הנוסחאות המתאימה לזה 
router.get('/',(req,res)=>{
    let result = Projects.filter(Boolean).map(project => {
        let average = project.rating && project.rating.length 
        ? project.rating.reduce((a,b)=>a+b,0)/project.rating.length : 0;
        return {
            ...project,average
        }
    })
    res.json(result)
});
router.post('/',upload.single('myProject'),(req,res)=>{
    let id = nextID++;
    let name = req.body.name;
    let description = req.body.description;
     if (name=="" || description=="") {
        return res.status(400).json({message: "Name and description are required"});
    }
    let filename = req.file ? req.file.filename:null;
    let rating = 0;
    let obj = {id,name,description,filename,rating: [],voters: [] };
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
        res.status(400).json({message:" not exist "});
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
        res.status(400).json({message : "not exist"});
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
        res.status(400).json({message :"Not exist !"});
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

    if(req.body.rating) {
        if(!project.rating) project.rating = [];
        let userIp = req.ip;
        if(project.voters.includes(userIp)){
            return res.status(400).json({message : "you already vote :-)"})
        }
         project.voters.push(userIp);
         project.rating.push(Number(req.body.rating)); 
    }


    res.json({message : " Updated "})
});



module.exports = router;
