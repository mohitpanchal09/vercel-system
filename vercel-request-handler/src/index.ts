import express from 'express'

const app = express();

app.get("/*",(req,res)=>{
    const host = req.hostname
    console.log(host)
    const id = host.split(".")[0]
    console.log(id)
})

app.listen(3001,()=>{
    console.log('Request handler service is running on 3001')
})
