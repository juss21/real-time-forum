
// WEBSOCKET
export class Client {
    constructor(type, payload) {
        this.type = type
        this.payload = payload
    }
}
let socket;

export function wsAddConnection(){
    let currentUser = JSON.parse(localStorage.getItem("currentUser"))
    socket = new WebSocket(`ws://${document.location.host}/ws?UserID=${currentUser}`)

    socket.onopen = () => {
        console.log("WebSocket Connection established!")
    }

    socket.onmessage = (e) => {
        console.log("Message recieved!")
    }

    socket.onclose = (e) => {
        console.log("WebSocket connection Lost!", e)
    }
}

export function sendData(data) {
        socket.send(JSON.stringify(data));
}