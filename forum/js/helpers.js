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
}

export async function hasCookie(cookie) {
    try {
        let response = await fetch(`/hasCookie?CookieKey=${cookie.CookieKey}&UserID=${cookie.UserID}`)
        
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