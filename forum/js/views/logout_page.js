import { hasSession } from "../helpers.js"
import { navigateTo } from "./router.js"

export default async function () {
    if (hasSession()) {
        let currentUser = JSON.parse(localStorage.getItem("currentUser"))
        logoutAttempt(currentUser)
    } else {
        navigateTo("/")
    }
}

async function logoutAttempt(currentUser) {
    window.location.href = "/login"
    try {
        let url = `/logout-attempt?UserID=${currentUser.UserID}`
        let response = await fetch(url)
        logoutResponse(response)
    } catch (e) {
        console.error(e)
        return false
    }
}

function logoutResponse(response) {
    if (response.ok) {
        console.log("[Response] Logout succeeded!")
        localStorage.removeItem("currentUser")
        //navigateTo("/login") 
    } else {
        console.log("logout failed!")
    }
}