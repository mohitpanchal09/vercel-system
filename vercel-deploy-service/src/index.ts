import { createClient,commandOptions } from "redis";
import { copyFinalDist, downloadS3Folder } from "./aws";
import { buildProject } from "./utils";
const subscriber = createClient()

subscriber.connect()  //localhost:6473

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
        //@ts-ignore
        await buildProject(id)
        //@ts-ignore
        await copyFinalDist(id)
    }
}
main()