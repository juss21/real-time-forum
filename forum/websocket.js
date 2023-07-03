let host = "localhost"


// WEBSOCKET
class Client {
    constructor() {
        this.mysocket = null
    }

    // "global" functions
    formTemplate(id, btnValue, action) {
        let form = document.getElementById(id);
        let submitter = document.querySelector(`button[value=${btnValue}]`);
        let formData = new FormData(form, submitter);
        let object = { action: `${action}` };
        formData.forEach((value, key) => object[key] = value);
        var json = JSON.stringify(object);
        this.mysocket.send(json);
    }

    changeForm(from, to) {
        let fromElements = from.split(" ")
        for (let f = 0; f < fromElements.length; f++) {
            document.getElementById(fromElements[f]).style = "display:none"
        }

        let toElements = to.split(" ")
        for (let t = 0; t < toElements.length; t++) {
            document.getElementById(toElements[t]).style = "display:inline"
        }
    }

    // fetching the port from file
    async fetchPort() {
        try {
            const resp = await fetch("port.txt");
            if (!resp.ok) {
                throw new Error("Failed to fetch the file");
            }
            const fileData = await resp.text();
            return fileData;
        } catch (error) {
            console.log("Error:", error);
        }
    }

    // establishing a connection between browser & server
    async connect() {
        try {
            const port = await this.fetchPort()

            let ws = new WebSocket(`ws://${host}:${port}/ws`)
            this.mysocket = ws

            ws.onopen = () => {
                console.log("WebSocket Connection established!")
            }
            ws.onmessage = (e) => {
                console.log("Message recieved!")
                let data = JSON.parse(e.data)
                if (data["Action"] === "Login") {
                    console.log(data)
                    document.getElementById("CurrentUser").innerHTML = data["Message"] !== undefined ? data["Message"] : "Welcome, guest!"
                    this.changeForm("loginForm newaccountForm", "forum logout")
                } if (data["Action"] === "Logout") {
                    this.changeForm("forum logout", "loginForm newaccountForm")
                }
            }
            ws.onclose = (e) => {
                console.log("WebSocket connection Lost!", e)
            }
        } catch (error) {
            console.log("Error:", error)
        }
    }

    // button actions

    sendLogin() {
        this.formTemplate("login", "Login", "login")
    }

    sendToRegister() {
        this.changeForm("loginForm newaccountForm", "registerForm")
    }

    sendRegister() {
        this.formTemplate("register", "Register", "register")
    }

    sendLogout(){
        this.changeForm("forum logout", "loginForm newaccountForm")
    }
}