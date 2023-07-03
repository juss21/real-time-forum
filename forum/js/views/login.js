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
    loginForm.action = "javascript:client.sendLogin()";
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

    // Create sendToRegister form
    const sendToRegisterForm = document.createElement("form");
    sendToRegisterForm.id = "sendToRegister";
    sendToRegisterForm.action = "javascript:client.sendToRegister()";

    // Create Create a new account button
    const newAccountButton = document.createElement("input");
    newAccountButton.type = "submit";
    newAccountButton.className = "button";
    newAccountButton.value = "Create a new account!";

    // Append new account button to sendToRegister form
    sendToRegisterForm.appendChild(newAccountButton);

    // Append sendToRegister form to newaccountForm div
    newaccountFormDiv.appendChild(sendToRegisterForm);

    // Appending newaccountForm div to body
    document.getElementById("app").appendChild(newaccountFormDiv)
}