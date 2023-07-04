import { isAuthenticated } from "../main.js";

export default async function() {
    if (!isAuthenticated){
        window.location.href = "/login"
    }

    document.title = "Home"

    document.getElementById("app").innerHTML = `
        <div id="home">
            <h1>Welcome to our forum!</h1>
        </div>
    `;
}
