import { S3 } from "aws-sdk"
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()


//filename=> output/12312/src/App.jsx  //file name on s3
//filepath=> Users/harkiratsingh/vercel/dist/output/12312/src/App.jsx

const s3 = new S3({
    accessKeyId:process.env.accessKeyId,
    secretAccessKey:process.env.secretAccessKey,
    region:process.env.region
})


export const uploadFile=async(fileName:string,localFilePath:string)=>{
    console.log('called')
    const fileContent = fs.readFileSync(localFilePath)
    const response = await s3.upload({
        Body:fileContent,
        Bucket:"vercel-project-bucket-09",
        Key:fileName,
    }).promise()
    console.log('response ',response)
}