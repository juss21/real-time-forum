import { hasSession } from "../helpers.js";
import { navigateTo } from "../main.js";

export default async function() {
    const isAuthenticated = await hasSession()
    if (!isAuthenticated){
        navigateTo("/login")
        window.location.href = "/login"
        return
    } else {

        const url = new URL(window.location.href)
        console.log(url)

        document.title = "Home"

        document.getElementById("app").innerHTML = `
            <div id="home">
                <h1>Welcome to our forum!</h1>
            </div>
        `

    }
}
