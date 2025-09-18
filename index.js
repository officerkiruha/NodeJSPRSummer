const express = require('express');
const path = require('path');
const app = express();
const port = 4500;

app.use(express.static(path.join(__dirname,'Public')));
app.use(express.json());

//Routers
app.get('/',(req,res)=>{res.sendFile(__dirname+'/Public/Projects.html')});
const Projects = require('./Routs/Projects');
app.use('/projects',Projects);

//Start
app.listen(port,()=>{console.log(`http://localhost:${port}`)});