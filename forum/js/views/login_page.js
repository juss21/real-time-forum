export default function () {
    document.getElementById("app").innerHTML = `
    <form id="loginForm" action="javascript:" method="POST">

        <input type="text" placeholder="Username" name="login_id" id="login_id">
        <input type="password" placeholder="Password" name="login_pw" id="login_pw">
        <button type="submit" class="button">login!</button>

    <br>
    <a id="ErrorBox"></a>
    </form>


    <a href="/register" class="nav__link" [data-link]="">Create a new account!</a>
    `;

    loginListener()
}

function loginListener(){
    let loginForm = document.getElementById("loginForm")
    let loginData = {}
    
    loginForm.addEventListener("submit", async (e) =>{
        console.log("submit button!")

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
        localStorage.setItem("userData", JSON.stringify(data))
        // window.location.href = "/"
        document.getElementById("ErrorBox").innerHTML = ""
    } else {
        document.getElementById("ErrorBox").innerHTML = "Bad login!"
    }
}
