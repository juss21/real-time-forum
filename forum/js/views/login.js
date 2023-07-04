export function fetchLoginPage() {
    fetch("/login")
        .then(response => response.json())
        .then(data => {
            navitageTo("/login")
        })
        .catch((error) => {
            console.log(error)
        })
}

export function createLoginPage() {
    document.getElementById("app").innerHTML = "";


    // Create loginForm div
    const loginFormDiv = document.createElement("div");
    loginFormDiv.id = "loginForm";

    // Create login form
    const loginForm = document.createElement("form");
    loginForm.id = "login";
    loginForm.action = "javascript:client.sendLoginMessage()";
    loginForm.method = "POST"

    // Create Username input
    const usernameInput = document.createElement("input");
    usernameInput.type = "text";
    usernameInput.placeholder = "Username";
    usernameInput.name = "login_id";
    // Create Password input
    const passwordInput = document.createElement("input");
    passwordInput.type = "password";
    passwordInput.placeholder = "Password";
    passwordInput.name = "login_pw";

    // Create Login button
    const loginButton = document.createElement("input");
    loginButton.type = "submit";
    loginButton.className = "button";
    loginButton.value = "Login";

    // Append elements to login form
    loginForm.appendChild(usernameInput);
    loginForm.appendChild(passwordInput);
    loginForm.appendChild(loginButton);

    // Append login form to loginForm div
    loginFormDiv.appendChild(loginForm);


    // Appending loginFrom div to body
    document.getElementById("app").appendChild(loginFormDiv)

    // Create newaccountForm div
    const newaccountFormDiv = document.createElement("div");
    newaccountFormDiv.id = "newaccountForm";

    // Create Create a new account button
    const newAccountHref = document.createElement("a");
    newAccountHref.href = "/register";
    newAccountHref.innerHTML = "Create a new account!";
    newAccountHref.className = "nav__link"

    // Append new account button to sendToRegister form
    newaccountFormDiv.appendChild(newAccountHref);


    // Appending newaccountForm div to body
    document.getElementById("app").appendChild(newaccountFormDiv)
}