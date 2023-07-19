// WEBSOCKET
import { wsIsConnected } from "./views/home_page.js"
import { createChat } from "./views/messenger.js"

export class Event {
    constructor(type, payload) {
        this.type = type
        this.payload = payload
    }
}

export function wsAddConnection() {
    if (window["WebSocket"]) {
        wsIsConnected()

        if (window.socket) window.socket.close()

        let currentUser = JSON.parse(localStorage.getItem("currentUser"))
        const ws = new WebSocket(`ws://${document.location.host}/ws?UserID=${currentUser.UserID}`)
        


        ws.onopen = () => {
            console.log("WebSocket Connection established!")
        }

        ws.onmessage = (e) => {
            console.log("WebSocket Message attempt")
            const eventData = JSON.parse(e.data)
            const event = Object.assign(new Event, eventData)

            routeEvent(event)
        }

        ws.onclose = (e) => {
            console.log("WebSocket connection Lost!", e)
        }

        window.socket = ws

        window.addEventListener('beforeunload', function() {
            ws.close();
        });
    } else {
        alert("This browser does not support websockets!")
    }
}

const functionMap = { //USAGE: functionMap["send_message"]();
    "send_message": sendData,
    "load_messages": loadChat,
    "get_online_members": loadOnlineMembers,
};

export function sendEvent(type, payload) {
    const event = new Event(type, payload)

    window.socket.send(JSON.stringify(event))
    routeEvent(event)
}

export async function routeEvent(event) {
    if (event.type === undefined) alert("Bad event!")
    functionMap[event.type](event.payload)
}

export function loadOnlineMembers(data) {
    const jsonString = JSON.stringify(data);
    document.getElementById("onlineMembers").innerHTML = jsonString + "👥"
}

export function loadChat(data) {
    // const jsonString = JSON.stringify(data);
    console.log("messages:", data.Messages)
    if (data.Messages === null || data.Messages === undefined) return
    createChat(data.Messages[0].ReceivingUser, data.Messages)
}

export function sendData(data) {
    const jsonString = JSON.stringify(data);
    console.log("Sent:", jsonString)
    //loadChat(data)
    
}

export function waitForWSConnection(socket, cb) {
    setTimeout(
        function () {
            if (socket && socket.readyState === 1) {
                console.log("WebSocket is connected!")
                if (cb != null) {
                    cb()
                }
            } else {
                console.log("Waiting for connection...")
                waitForWSConnection(socket, cb)
            }
        }, 10);
}
