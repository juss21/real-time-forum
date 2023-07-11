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
                <input type="text" placeholder="E-mail" name="register_email" id="register_email"><br>
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

    verifyForm("register_nickname", /^[A-Za-z\d\-_\.]+$/, "Nickname is too short!", "Bad characters in nickname!")
    verifyForm("register_gender", /^[A-Za-z\d\-_\.]+$/, "Gender is too short!", "Bad characters in Gender!")
    verifyForm("register_fname", /^[A-Za-z\-_\.]+$/, "First name is too short!", "First name contains of letters!", 1)
    verifyForm("register_lname", /^[A-Za-z\-_\.]+$/, "Last name is too short!", "Last name contains of letters!", 1)
    verifyForm("register_email", /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, "Nickname is too short!", "Bad characters in nickname!")
    verifyAge()

    let registerForm = document.getElementById("registerForm")
    let registerData = {}

    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault()

        var formData = new FormData(registerForm)

        const isValid = checkIfValidAttempt(formData.entries())
        if (isValid) {


            for (var [key, value] of formData.entries()) {
                registerData[key] = value
            }

            console.log(registerData)
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
        }
    })
}

function checkIfValidAttempt(formData) {
    let isValid = true
    for (var [_, value] of formData) {
        if (!value){
            isValid = false
            document.getElementById("ErrorBox").innerHTML = `Fields cannot be empty!`
        }
    }
    return isValid
}

async function registerResponse(response) {
    if (response.ok) {
        navigateTo("/login")
        //        window.location.href = "/" 
    } else {
        let message = await response.text()
        console.log(message)
        if (message.includes("name")) document.getElementById("ErrorBox").innerHTML = "Nickname already taken!"
        if (message.includes("email")) document.getElementById("ErrorBox").innerHTML = "Email already in use!"
        if (message.includes("passwd")) document.getElementById("ErrorBox").innerHTML = "Password cannot be empty!"

    }
}


// input verification

function verifyForm(id, pattern, errorMsg1, errorMsg2, min = 3) {
    let element = document.getElementById(id)
    element.addEventListener("input", () => {
        const match = pattern.test(element.value)

        if (element.value.length < min) {
            document.getElementById("ErrorBox").innerHTML = errorMsg1
        } else if (!match) {
            document.getElementById("ErrorBox").innerHTML = errorMsg2
        } else {
            document.getElementById("ErrorBox").innerHTML = ""
        }
    })
}

function verifyAge() {
    let age = document.getElementById("register_age")
    age.addEventListener("input", () => {
        if (age.value < 3) {
            document.getElementById("ErrorBox").innerHTML = "Too young of an age!"
        } else if (age.value > 80) {
            document.getElementById("ErrorBox").innerHTML = "Too old of an age!"
        } else if (isNaN(age.value)) {
            document.getElementById("ErrorBox").innerHTML = "Age has a numeric value!"
        } else {
            document.getElementById("ErrorBox").innerHTML = ""
        }
    })
}
