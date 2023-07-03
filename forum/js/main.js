// Create loginForm div
const loginFormDiv = document.createElement("div");
loginFormDiv.id = "loginForm";

// Create login form
const loginForm = document.createElement("form");
loginForm.id = "login";
loginForm.action = "javascript:client.sendLogin()";

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


// Create registerForm div
const registerFormDiv = document.createElement("div");
registerFormDiv.id = "registerForm";
registerFormDiv.style.display = "none";

// Create register form
const registerForm = document.createElement("form");
registerForm.id = "register";
registerForm.action = "javascript:client.sendRegister()";

// Create input fields for registration
const nicknameInput = document.createElement("input");
nicknameInput.type = "text";
nicknameInput.placeholder = "Nickname";
nicknameInput.name = "register_nickname";

const ageInput = document.createElement("input");
ageInput.type = "text";
ageInput.placeholder = "Age";
ageInput.name = "register_age";

const genderInput = document.createElement("input");
genderInput.type = "text";
genderInput.placeholder = "Gender";
genderInput.name = "register_gender";

const firstNameInput = document.createElement("input");
firstNameInput.type = "text";
firstNameInput.placeholder = "First Name";
firstNameInput.name = "register_fname";

const lastNameInput = document.createElement("input");
lastNameInput.type = "text";
lastNameInput.placeholder = "Last Name";
lastNameInput.name = "register_lname";

const emailInput = document.createElement("input");
emailInput.type = "text";
emailInput.placeholder = "E-mail";
emailInput.name = "register_mail";

const passwordInput2 = document.createElement("input");
passwordInput2.type = "text";
passwordInput2.placeholder = "Password";
passwordInput2.name = "register_passwd";

// Create Register button
const registerButton = document.createElement("input");
registerButton.type = "submit";
registerButton.className = "button";
registerButton.value = "Register";

// Append input fields and Register button to register form
registerForm.appendChild(nicknameInput);
registerForm.appendChild(ageInput);
registerForm.appendChild(genderInput);
registerForm.appendChild(firstNameInput);
registerForm.appendChild(lastNameInput);
registerForm.appendChild(emailInput);
registerForm.appendChild(passwordInput2);
registerForm.appendChild(registerButton);

// Append register form to registerForm div
registerFormDiv.appendChild(registerForm);


// Create forum div
const forumDiv = document.createElement("div");
forumDiv.id = "forum";
forumDiv.style.display = "none";
forumDiv.textContent = "Tervetuloa! Seen meie foorium";

// Create logout div
const logoutDiv = document.createElement("div");
logoutDiv.id = "logout";
logoutDiv.style.display = "none";

// Create CurrentUser heading
const currentUserHeading = document.createElement("h3");
currentUserHeading.id = "CurrentUser";

// Create logout form
const logoutForm = document.createElement("form");
logoutForm.id = "logout";
logoutForm.action = "javascript:client.sendLogout()";

// Create Logout button
const logoutButton = document.createElement("input");
logoutButton.type = "submit";
logoutButton.className = "button";
logoutButton.value = "Logout";

// Append CurrentUser heading and Logout button to logout form
logoutForm.appendChild(logoutButton);

// Append CurrentUser heading and logout form to logout div
logoutDiv.appendChild(currentUserHeading);
logoutDiv.appendChild(logoutForm);

// Add all elements to the document
document.body.appendChild(loginFormDiv);
document.body.appendChild(newaccountFormDiv);
document.body.appendChild(registerFormDiv);
document.body.appendChild(forumDiv);
document.body.appendChild(logoutDiv);


