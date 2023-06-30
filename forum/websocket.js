let host = "localhost"

// WEBSOCKET
class Client {
    constructor(){
        this.mysocket = null
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
                console.log("WebSocket Message Received!")
            }


            ws.onclose = (e) => {
                console.log("WebSocket connection Lost!", e)
            }

        } catch (error) {
            console.log("Error:", error)
        }
    }


    formTemplate(id, btnValue, action){
        let form = document.getElementById(id);
        let submitter = document.querySelector(`button[value=${btnValue}]`);
        let formData = new FormData(form, submitter);
        let object = { action: `${action}` };
        formData.forEach((value, key) => object[key] = value);
        var json = JSON.stringify(object);
        this.mysocket.send(json);
    }


    
    // button actions

    sendLogin() {
        this.formTemplate("welcome", "Login", "login")
    }

    sendRegister(){
        this.formTemplate("register", "Register", "register")
    }



}


