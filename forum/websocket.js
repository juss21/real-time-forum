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

    register(){
        console.log("jah")
        Register()
    }

    getTest() {
        let form = document.getElementById("welcome");
        let submitter = document.querySelector("button[value=Login]");
        let formData = new FormData(form, submitter);
        let object = { action: "getTest" };
        formData.forEach((value, key) => object[key] = value);
        var json = JSON.stringify(object);
        this.mysocket.send(json);

        // console.log("terekest!")
        // this.mysocket.send(JSON.stringify( { action: "getTest"}))
    }

    getTest2(){
        let form = document.getElementById("register");
        let submitter = document.querySelector("button[value=New]");
        let formData = new FormData(form, submitter);
        let object = { action: "katsetus" };
        formData.forEach((value, key) => object[key] = value);
        var json = JSON.stringify(object);
        this.mysocket.send(json);

    }
}


const Register = () => {
    console.log(document.getElementById("register_nickname").innerHTML)
    console.log(document.getElementById("register_nickname").innerText)
}