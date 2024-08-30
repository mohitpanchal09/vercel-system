import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import { generate } from "./utils";
import path from "path";
import { getAllFiles } from "./file";
import { uploadFile } from "./aws";
import { createClient } from "redis";
const publisher = createClient()
publisher.connect()

// uploadFile('mohit/package.json','/Users/mohitpanchal/Desktop/vercel/dist/output/8j6g5/package.json')
const app = express();
app.use(cors())
app.use(express.json())
console.log(__dirname)
app.post('/deploy',async (req,res)=>{
    const repoUrl = req.body.url //github url
    const id = generate()
    await simpleGit().clone(repoUrl,path.join(__dirname,`output/${id}`))

    const files =  getAllFiles(path.join(__dirname,`output/${id}`))
   
    files.forEach((file)=>console.log(file))
    files.forEach(async (file)=>{
        await uploadFile(file .slice(__dirname.length+1),file) //slice will give output=> output/12312/src/App.jsx
    })
    publisher.lPush("build-queue",id)
    res.json({
        id:id
    })
})

app.listen(3000,()=>{
    console.log('server listening at 3000')
})