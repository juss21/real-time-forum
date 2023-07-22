// WEBSOCKET
import { createUserList, displayMessages, displayIsWriting } from "./views/messenger.js"
import { createPostHtml } from "./views/postComment.js"
export class Event {
    constructor(type, payload) {
        this.type = type
        this.payload = payload
    }
}

export function wsAddConnection() {
    if (window["WebSocket"]) {

        if (window.socket) window.socket.close()

        let currentUser = JSON.parse(sessionStorage.getItem("CurrentUser"))
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

const functionMap = { 
    //USAGE: functionMap["send_message"]();
    "send_message": sendData,
    "load_all_messages": loadChat,
    "load_message": loadMessage,
    "load_posts": loadPosts,
    "update_users": updateUserList,
    "get_online_members": loadOnlineMembers,
    "is_typing": updateIsTyping,
};

function updateIsTyping(data){
    displayIsWriting(data.receivingUser, data.currentUser)
}

export function loadPosts(data){
   createPostHtml(data)
}

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
    document.getElementById("onlineMembers").innerHTML = data.length + "👥"
   // createUserList(sessionStorage.getItem("CurrentUser").UserID, data) // create user list >HERE<
}
export function updateUserList(data) {
    if (document.getElementById("messageBox").innerHTML != "") createUserList(data, document.getElementById("messageBox"))
}

export function loadChat(data) {
    // const jsonString = JSON.stringify(data);
    console.log("messages:", data)
    //if (data.Messages === null || data.Messages === undefined) return
    displayMessages(data.ReceiverName, data.userName, data.Messages, true)
}

export function loadMessage(data) {
    displayMessages(data.ReceiverName, data.userName, data.Messages)
    //displayNotification(data.ReceiverName, data.userName)
}

export function sendData(data) {
    const jsonString = JSON.stringify(data);
    console.log("Sent:", jsonString)
    //loadChat(data)
    
}

export function waitForWSConnection(socket, cb, counter = 30) {
    setTimeout(
        function () {
            if (socket && socket.readyState === 1) {
                console.log("WebSocket is connected!")
                if (cb != null) {
                    cb()
                }
            } else {
                console.log("Waiting for connection...")
                if (counter > 0) waitForWSConnection(socket, cb, counter - 1)
                else window.location.href = "/login"
            }
        }, 100);
}
