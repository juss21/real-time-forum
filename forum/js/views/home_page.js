import { hasSession } from "../helpers.js";
import { navigateTo } from "./router.js";

export default async function () {
    const isAuthenticated = await hasSession()
    if (!isAuthenticated) {
        navigateTo("/login")
        return
    } else {
        let currentUser = JSON.parse(localStorage.getItem("currentUser"))

        document.title = "Home"

        document.getElementById("app").innerHTML = `

        <nav class="nav">
        <a href="/" class="nav__link" data-link>Home</a>
        <a href="/login" class="nav__link" data-link>Login</a>
        <a href="/logout" class="nav__link" data-link>Logout</a>
    </nav>
        <div id="home">
                <h1>Welcome to our forum, ${currentUser.LoginName}!</h1>
            </div>
        `

    }
}
