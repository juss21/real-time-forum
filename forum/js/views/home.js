export function createHomePage() {
    document.getElementById("app").innerHTML = "";

    // Create registerForm div
    const homeFormDiv = document.createElement("div");
    homeFormDiv.id = "homeForm";
    
    const text = document.createElement("h1")
    text.innerHTML = "Welcome!"

    homeFormDiv.appendChild(text)


    document.getElementById("app").appendChild(homeFormDiv)
}
