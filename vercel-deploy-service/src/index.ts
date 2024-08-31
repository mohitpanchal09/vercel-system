import { createClient,commandOptions } from "redis";
import { copyFinalDist, downloadS3Folder } from "./aws";
import { buildProject } from "./utils";
const subscriber = createClient()

subscriber.connect()  //localhost:6473

const publisher = createClient()
publisher.connect()

async function main(){
    while(1){
        const response = await subscriber.brPop( //to pop the element from the build-queue
            commandOptions({isolated:true}),
            "build-queue",
            0
        )
        console.log(response)
        const id = response?.element
        // @ts-ignore
        await downloadS3Folder(`output/${id}`)
        
        await buildProject(id as string)
        
        await copyFinalDist(id as string)
        
        publisher.hSet("status",id as string,"deployed")
    }
}
main()