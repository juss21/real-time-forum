export async function hasSession(){
    if (localStorage.getItem("userData")){
        let userData = JSON.parse(localStorage.getItem("userData"))
        let sessionExists = await hasCookie(userData.cookieId)
        if (sessionExists){
            return true
        } else {
            localStorage.removeItem("userData")
        }
    }
}

export async function hasCookie(){
    try {
        // let response = await fetch("/hasCookie")
        return true
    } catch (e){
        console.error(e)
        return false
    }
}