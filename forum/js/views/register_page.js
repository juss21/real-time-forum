import { navigateTo } from "./router.js"

export default function () {

    document.title = "Register"

    document.getElementById("app").innerHTML = `
            <form id="registerForm" method="POST" class="home">
            <br>
            <h1>Registration page</h1>    
            <br>
                <input type="text" placeholder="Nickname" name="register_nickname" id="register_nickname"><br>
                <input type="text" placeholder="Age" name="register_age" id="register_age"><br>
                <input type="text" placeholder="Gender" name="register_gender" id="register_gender"><br>
                <input type="text" placeholder="First Name" name="register_fname" id="register_fname"><br>
                <input type="text" placeholder="Last Name" name="register_lname" id="register_lname"><br>
                <br>
                <input type="text" placeholder="E-mail" name="register_mail" id="register_mail"><br>
                <input type="password" placeholder="Password" name="register_passwd" id="register_passwd"><br>
                <br>
                <a id="ErrorBox"> </a>
                <br><br>
                <button type="submit" class="button">Register!</button>
                <br>
                <br>

            <a href="/login" class="nav__link" [data-link]="">Already have an account?</a>
            </form>
            

    `

    registerListener()
}


function registerListener() {

    verifyNickname()

    let registerForm = document.getElementById("registerForm")
    let registerData = {}

    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault()

        var formData = new FormData(registerForm)

        for (var [key, value] of formData.entries()) {
            registerData[key] = value
        }

        const options = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registerData)
        }

        try {
            let response = await fetch("/register-attempt", options)
            registerResponse(response)
        } catch (e) {
            console.error(e)
        }
    })
}

async function registerResponse(response) {
    if (response.ok) {
        navigateTo("/login")
        //        window.location.href = "/" 
    } else {
        let message = await response.text()
        if (message.includes("name")) document.getElementById("ErrorBox").innerHTML = "Nickname already taken!"
        if (message.includes("email")) document.getElementById("ErrorBox").innerHTML = "Email already in use!"
    }
}


// input verification

function verifyNickname() {
    let nickname = document.getElementById("register_nickname")
    nickname.addEventListener("input", () => {

        // const pattern = /^[a-zA-Z0-9\-_]$/
        //const match = pattern.test(nickname.value)

        if (nickname.value.length < 3) {
            document.getElementById("ErrorBox").innerHTML = "Nickname is too short!"
        }
        //  if (!match){
        //      document.getElementById("ErrorBox").innerHTML = "Bad characters in nickname!"
        //  }

    })
}

