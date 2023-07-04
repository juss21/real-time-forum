// WEBSOCKET
export class Client {
    constructor(type, payload) {
        this.type = type
        this.payload = payload
    }
}


export function wsAddConnection(){
    let user = JSON.parse(localStorage.getItem("userData"))
    let ws = new WebSocket(`ws://${document.location.host}/ws`)

    ws.onopen = () => {
        console.log("WebSocket Connection established!")
    }

    ws.onmessage = (e) => {
        console.log("Message recieved!")
    }

    ws.onclose = (e) => {
        console.log("WebSocket connection Lost!", e)
    }
}