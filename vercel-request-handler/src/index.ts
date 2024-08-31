import express from 'express'
import {S3} from "aws-sdk"
import dotenv from 'dotenv';
dotenv.config()

const s3 = new S3({
    accessKeyId:process.env.accessKeyId,
    secretAccessKey:process.env.secretAccessKey,
    region:process.env.region
})

const app = express();

app.get("/*",async (req,res)=>{

    //id.vercel.com=>id
    const host = req.hostname
    console.log(host)
    const id = host.split(".")[0]
    console.log(id)
    const filePath = req.path; //this is the path user trying to get like index.html
    console.log(filePath) 

    const contents = await s3.getObject({
        Bucket:"vercel-project-bucket-09",
        Key:`dist/${id}${filePath}`
    }).promise()

    const type = filePath.endsWith("html") ?"text/html":filePath.endsWith("css")?"text/css":"application/javascript"
    res.set("Content-Type",type)
    res.send(contents.Body)
})

app.listen(3001,()=>{
    console.log('Request handler service is running on 3001')
})
