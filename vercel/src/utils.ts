const MAX_LEN= 5

export function generate():string{
    let ans = "";
    const subset ="123456789asdfghjklpoiuytrenmvxqw"
    for(let i = 0;i<MAX_LEN;i++){
        ans+=subset[Math.floor(Math.random()*subset.length)]
    }
    return ans
}