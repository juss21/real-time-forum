// WEBSOCKET
import { createChat } from "./views/messenger.js"

export function wsAddConnection() {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"))
    let socket = new WebSocket(`ws://${document.location.host}/ws?UserID=${currentUser}`)

    socket.onopen = () => {
        console.log("WebSocket Connection established!")
    }

    socket.onmessage = (e) => {
        if (e.data) {
            console.log(e.data)
            routeEvent(e.data);
        } else {
            console.log("Cannot send undefined data");
        }
    }

    socket.onclose = (e) => {
        console.log("WebSocket connection Lost!", e)
    }

    window.socket = socket

}

const functionMap = { //USAGE: functionMap["send_message"]();
    "send_message": sendData,
    "load_message": loadChat,
};

export async function routeEvent(data) {
    if (data.type === undefined || !functionMap[data.type](data)) {
        if (data) {
            let messageInfo = JSON.parse(data)
            createChat(messageInfo.ReceiverName, messageInfo.Messages)
        }
        return
    }
    functionMap[data.type](data);
    //socket.send(JSON.stringify(data))
}

export function loadChat(data) {
    const jsonString = JSON.stringify(data);
    socket.send(jsonString)

}

export function sendData(data) {
    socket.send(JSON.stringify(data));
}
