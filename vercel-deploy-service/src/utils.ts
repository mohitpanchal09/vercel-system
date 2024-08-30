import { exec } from "child_process"
import * as path from 'path';



export function buildProject(id:string){
    console.log(id)
    return new Promise((resolve)=>{
        const child= exec(`cd ${path.join(__dirname,`output/${id}`)} && npm install --legacy-peer-deps &&  npm run build`)
        child.stdout?.on('data',(data)=>{
            console.log(`stdout: ${data}`)
        })
        child.stderr?.on('data',(data)=>{
            console.log(`stderr: ${data}`)
        })
        child.on('close',(data)=>{
            resolve("");
        })
    })
}

