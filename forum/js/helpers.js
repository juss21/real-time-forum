import { navigateTo } from "./views/router.js"

export async function hasSession() {
    if (localStorage.getItem("currentUser")) {
        let currentUser = JSON.parse(localStorage.getItem("currentUser"))
        let sessionExists = await hasCookie(currentUser)
        if (sessionExists) {
            return true
        } else {
            localStorage.removeItem("currentUser")
        }
    }
    navigateTo("/login")
    return false
}

export async function hasCookie(cookie) {

    try {
        const url = `/hasCookie?CookieKey=${cookie.CookieKey}&UserID=${cookie.UserID}`
        
        //await new Promise(resolve => setTimeout(resolve, 50));

        const response = await fetch(url)
        
        if (response.ok) {
            console.log("session found")
            return true
        } else {
            console.log("session failed")
            return false
        }
    } catch (e) {
        console.error(e)
        return false
    }
}