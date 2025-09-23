const express = require('express');
const path = require('path');
const app = express();
const port = 4500;

app.use(express.static(path.join(__dirname,'Public')));
app.use('/Uploads', express.static(path.join(__dirname, 'Uploads')));
app.use(express.json());

//Routers
const Projects = require('./Routs/Projects');
app.use('/projects',Projects);
app.get('/',(req,res)=>{res.sendFile(__dirname+'/Public/Projects.html')});

//Start
app.listen(port,()=>{console.log(`http://localhost:${port}`)});
