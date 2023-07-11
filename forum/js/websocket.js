
// WEBSOCKET
export class Event {
    constructor(type, payload) {
        this.type = type
        this.payload = payload
    }
}

export function wsAddConnection() {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"))
    let socket = new WebSocket(`ws://${document.location.host}/ws?UserID=${currentUser}`)

    socket.onopen = () => {
        console.log("WebSocket Connection established!")
    }

    socket.onmessage = (e) => {
        console.log("Message recieved!")


        const eData = JSON.parse(e.data)

        const event = Object.assign(new Event, eData)

        routeEvent(event)
    }

    socket.onclose = (e) => {
        console.log("WebSocket connection Lost!", e)
    }

    window.socket = socket

}

export function routeEvent(event) {
    if (event.type === "send_message") {
        // sendData(event.payload)
        console.log("WS send message!")
    } else if (event.type === "load_messages"){
        console.log("ws load messages!")
    }
}

export function sendEvent(eventName, payload) {
    let event = new Event(eventName, payload)
    console.log("socket", window.socket)
    console.log("event",event)
    window.socket.send(JSON.stringify(event))
    routeEvent(event)
}

export function sendData(data) {
    sendEvent("send_message", data)
    //        socket.send(JSON.stringify(data));
}