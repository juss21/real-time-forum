import { hasSession } from "../helpers.js";
import { navigateTo } from "./router.js";

export default async function () {
    const isAuthenticated = await hasSession()
    if (!isAuthenticated) {
        navigateTo("/login")
        return
    } else {

        document.title = "Home"

        document.getElementById("app").innerHTML = `
            <div id="home">
                <h1>Welcome to our forum!</h1>
            </div>
        `

    }
}
