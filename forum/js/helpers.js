export async function hasSession() {
    if (localStorage.getItem("currentUser")) {
        let currentUser = JSON.parse(localStorage.getItem("currentUser"))
        let sessionExists = await hasCookie(currentUser.CookieKey)
        if (sessionExists) {
            return true
        } else {
            localStorage.removeItem("currentUser")
        }
    }
}

export async function hasCookie(key) {
    try {
        let response = await fetch(`/hasCookie?CookieKey=${key}`)
        
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