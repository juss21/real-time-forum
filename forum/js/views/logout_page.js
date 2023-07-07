import { hasSession } from "../helpers.js"

export default async function () {
    if (hasSession()){
        let currentUser = JSON.parse(localStorage.getItem("currentUser"))
        logoutAttempt(currentUser)
    }
}

async function logoutAttempt(currentUser){
    try {
        let url = `/logout-attempt?UserID=${currentUser}`
        let response = await fetch(url)
        logoutResponse(response)
    } catch (e){
        console.error(e)
        return false
    } 
}

function logoutResponse(response){
    if (response.ok){
        console.log("[Response] Logout succeeded!")
        localStorage.removeItem("currentUser")

        window.location.href = "/login"
    } else {
        console.log("logout failed!")
    }
}