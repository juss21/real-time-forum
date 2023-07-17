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

export async function getOnlineUsers() {
    try {
        const url = `/get-active-users`;
        const response = await fetch(url);

        if (response.ok) {
            console.log(response)
            let data = await response.json();
            document.getElementById("onlineMembers").innerHTML = data.Amount + "👥"
        } else {
            console.log("Failed to fetch comments data.");
        }
    } catch (e) {
        console.error(e);
    } finally {
        // polling
        getOnlineUsers()
    }
}
