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

const subscriber = createClient()
subscriber.connect()

// uploadFile('mohit/package.json','/Users/mohitpanchal/Desktop/vercel/dist/output/8j6g5/package.json')
const app = express();
app.use(cors())
app.use(express.json());

app.post('/deploy',async (req,res)=>{
    const repoUrl = req.body.repoUrl //github url
    const id = generate()
    console.log(repoUrl)
    await simpleGit().clone(repoUrl,path.join(__dirname,`output/${id}`))

    const files =  getAllFiles(path.join(__dirname,`output/${id}`))
   
    
    // Create an array of promises for file uploads
    const uploadPromises = files.map((file) => {
        return uploadFile(file.slice(__dirname.length + 1), file);
    });

    // Wait for all uploads to complete
    await Promise.all(uploadPromises);
    publisher.lPush("build-queue",id)
    publisher.hSet("status",id,"uploaded")  //like insert in sql
    
    res.json({
        id:id
    })
})

app.get('/status',async(req,res)=>{
    const id = req.query.id;
    const response = await subscriber.hGet("status",id as string)
    res.json({
        status:response
    })
})

app.listen(3000,()=>{
    console.log('server listening at 3000')
})