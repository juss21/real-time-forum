function createInputLayer(appendElement, type, placeholder, name, action = "") {
    const element = document.createElement("input");
    element.type = "text";
    element.placeholder = "E-mail";
    element.name = "register_mail";
    appendElement.appendChild(element)
}

export function createRegisterPage() {
    document.getElementById("app").innerHTML = "";

    // Create registerForm div
    const registerFormDiv = document.createElement("div");
    registerFormDiv.id = "registerForm";

    // Create register form
    const registerForm = document.createElement("form");
    registerForm.id = "register";
    registerForm.action = "javascript:client.sendRegisterMessage()";
    registerForm.method = "POST"

    // Create input fields for registration
    createInputLayer(registerForm, "text", "Nickname", "register_nickname")

    createInputLayer(registerForm, "text", "Age", "register_age")

    createInputLayer(registerForm, "text", "Gender", "register_gender")

    createInputLayer(registerForm, "text", "First Name", "register_fname")

    createInputLayer(registerForm, "text", "Last Name", "register_lname")

    createInputLayer(registerForm, "text", "E-mail", "register_mail")

    createInputLayer(registerForm, "text", "Password", "register_passwd")

    // Create Register button
    const registerButton = document.createElement("input");
    registerButton.type = "submit";
    registerButton.className = "button";
    registerButton.value = "Register";

    // Append input fields and Register button to register form
    registerForm.appendChild(registerButton);
    // Append register form to registerForm div
    registerFormDiv.appendChild(registerForm);

    document.getElementById("app").appendChild(registerFormDiv)
}
