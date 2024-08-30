import { S3 } from "aws-sdk";
import * as fs from 'fs'; // or import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config()
const s3 = new S3({
    accessKeyId:process.env.accessKeyId,
    secretAccessKey:process.env.secretAccessKey,
    region:process.env.region
})

// here prefix is the path on s3 to download from example: output/asfd
export async function downloadS3Folder(prefix: string) {
    const allFiles = await s3.listObjectsV2({
        Bucket: "vercel-project-bucket-09",
        Prefix: prefix,
    }).promise();

    console.log('allFiles:', allFiles);
    
    if (!allFiles.Contents) {
        return;
    }

    const downloadPromises = allFiles.Contents.map(async ({ Key }) => {
        return new Promise<void>(async (resolve, reject) => {
            console.log('Key =>', Key);
            if (!Key) {
                resolve();
                return;
            }

            const finalOutputPath = path.join(__dirname, Key);
            const dirName = path.dirname(finalOutputPath);

            if (!fs.existsSync(dirName)) {
                fs.mkdirSync(dirName, { recursive: true });
            }

            const outputFile = fs.createWriteStream(finalOutputPath);
            s3.getObject({
                Bucket: "vercel-project-bucket-09",
                Key: Key
            }).createReadStream().pipe(outputFile)
              .on("finish", () => {
                  console.log('Downloaded');
                  resolve();
              })
              .on("error", (err) => {
                  console.error('Error downloading:', Key, err);
                  reject(err);
              });
        });
    });

    console.log('Awaiting downloads...');
    await Promise.all(downloadPromises);
}

export function copyFinalDist(id:string){
    const folderPath =path.join(__dirname,`output/${id}/dist`)
    const allFiles = getAllFiles(folderPath)
    allFiles.forEach(file=>{
        uploadFile(`dist/${id}/`+file.slice(folderPath.length+1),file)
    })
}

export const getAllFiles=(folderPath:string)=>{
    // folderpath=> /users/mohit/desktop/vercel/dist/output/id
    let response:string[]=[];

    const allFilesAndFolders = fs.readdirSync(folderPath);
    allFilesAndFolders.forEach(file=>{
        const fullFilePath=path.join(folderPath,file)
        if(fs.statSync(fullFilePath).isDirectory()){
            response = response.concat(getAllFiles(fullFilePath))
        }else{
            response.push(fullFilePath)
        }
    })
    return response
 
    // const allFilesAndFolders
}

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