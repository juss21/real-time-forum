import { hasSession } from "../helpers.js";
import { navigateTo } from "./router.js";

export default async function () {
    const isAuthenticated = await hasSession()

    await loadPosts()

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

async function loadPosts() {
    try {
        url = "/get-posts"
        response = await fetch(url)
        loadPostsResponse(response)
    } catch (e) {
        console.error(e)
        return
    }
}
function loadPostsResponse(response) {
    if (response.ok) {

    } else {

    }
}

function loginListener(){
    let loginForm = document.getElementById("loginForm")
    let loginData = {}
    
    loginForm.addEventListener("submit", async (e) =>{
        e.preventDefault()
        
        var formData = new FormData(loginForm)

        for (var [key, value] of formData.entries()){
            loginData[key] = value
        }

        const options = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData)
        }

        try {
            let response = await fetch("/login-attempt", options)
            loginResponse(response)
        } catch  (e){
            console.error(e)
        }
    })
}

async function loginResponse(response){
    if (response.ok){
        let data = await response.json()
        localStorage.setItem("currentUser", JSON.stringify(data))
        navigateTo("/") 
//        window.location.href = "/" 
    } else {
        let message = await response.text()
        document.getElementById("ErrorBox").innerHTML = message.replace()
    }
}
