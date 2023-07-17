import { hasSession } from "../helpers.js"
import { sendEvent } from "../websocket.js"
import { navigateTo } from "./router.js"
import { wsIsDisConnected } from "./home_page.js"

export default async function () {
    if (hasSession()) {
        let currentUser = JSON.parse(localStorage.getItem("currentUser"))
        logoutAttempt(currentUser)
    } else {
        navigateTo("/")
    }
}

async function logoutAttempt(currentUser) {
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
        navigateTo("/login") 
        wsIsDisConnected()
    } else {
        console.log("logout failed!")
    }
}