import { routeEvent, loadChat, sendEvent } from "../websocket.js";
import { hasSession } from "../helpers.js";

let messageBox;

export function openMessenger() {
    fetchUsers("messageBox");
    messageBox = document.getElementById("messageBox")
    let openButton = document.getElementById("openButton")
    openButton.style.display = "none";
    messageBox.style.display = "block";
}


export function createUserList(id, userData) {

    const element = document.getElementById(id);
    element.innerHTML = "";

    const userList = document.createElement('div');
    userList.className = "messageUsers";

    for (let i = 0; i < userData.length; i++) {
        const userName = userData[i].UserName;
        const userNameElement = document.createElement("div");
        userNameElement.textContent = userName;
        userNameElement.id = userName
        userNameElement.className = "username"

        userNameElement.addEventListener("click", () => {
            let currentUser = JSON.parse(localStorage.getItem("currentUser"))
            createChat(currentUser.LoginName, userName)
        });
        userList.appendChild(userNameElement)
    }

    element.appendChild(userList)

    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.type = "button";
    closeButton.className = "cancel";

    closeButton.addEventListener("click", () => {
        let openButton = document.getElementById("openButton")

        element.style.display = "none";
        openButton.style.display = "block";
    });

    element.appendChild(closeButton);
}

export async function fetchUsers(id) {
    try {
        let currentUser = JSON.parse(localStorage.getItem("currentUser"))
        let url = `/get-users?UserID=${currentUser.UserID}`
        const response = await fetch(url);

        if (response.ok) {
            let data = await response.json();
            createUserList(id, data)
        } else {
            console.log("Failed to fetch user data.");
        }
    } catch (e) {
        console.error(e);
    }
}


export function loadAllMessages(senderUser, receivingUser) {
    const chatResponse = {
        userName: senderUser,
        receivingUser: receivingUser,
    };
    sendEvent("load_all_messages", chatResponse)
}

export function loadMessage(senderUser, receivingUser) {
    const chatResponse = {
        userName: senderUser,
        receivingUser: receivingUser,
    };
    sendEvent("load_message", chatResponse)
}


export function displayMessages(receivingUser, previousMessages) {

    const currentUser = JSON.parse(localStorage.getItem("currentUser"))

    const chat = document.getElementById('chat')

    if (previousMessages) {
        previousMessages.forEach((message) => {
            const chatLog = document.createElement("div")
            if (message.UserName === currentUser.LoginName) {
                chatLog.innerHTML = `<span style='color: PaleGreen;'> ${message.UserName}</span> ` +
                `<span style='color:rgb(192, 192, 192);'>${message.MessageDate}</span>:<br>` + message.Message;
            } else {
                chatLog.innerHTML = `<span style='color: MediumBlue;'> ${message.UserName}</span> ` +
                `<span style='color:rgb(192, 192, 192);'>${message.MessageDate}</span>:<br>` + message.Message;
            }

            chat.appendChild(chatLog);
            if (message.UserName === currentUser.LoginName || chat.scrollTop + chat.clientHeight >= chat.scrollHeight-50) chat.scrollTo(0, chat.scrollHeight)
        });
    }
    if (previousMessages && previousMessages.length > 1) chat.scrollTo(0, chat.scrollHeight)
}

export function createChat(currentUser, receivingUser) {

    if (document.getElementById("chat")) {
        document.getElementById("chat").remove()
    }
    const chat = document.createElement("div");
    chat.id = "chat";
    loadAllMessages(currentUser, receivingUser)

    const textArea = document.createElement("textarea")
    textArea.id = "textBox"
    textArea.placeholder = `Send ${receivingUser} a message!`;
    textArea.maxLength = "10000"
    textArea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
            e.preventDefault();

            console.log("Enter keypress>", currentUser, receivingUser)
            sendMessage(textArea.value, currentUser, receivingUser) // send message to server
            //createChat(currentUser, receivingUser)
            textArea.value = "";
            
            return
        }
    });
    const messageBox = document.getElementById('messageBox');
    chat.appendChild(textArea)
    messageBox.appendChild(chat);
}

async function sendMessage(Message, Sender, Receiver) {
    try {
        let url = `/send-message`

        const request = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Message: Message,
                SenderName: Sender,
                ReceiverName: Receiver,
            })
        }

        console.log("request>", request.body)

        const response = await fetch(url, request);

        if (response.ok) {
            console.log(response.ok)
            // let data = await response.json();
            // createUserList(id, data)
            loadMessage(Sender, Receiver)
        } else {
            console.log("Failed to fetch user data.");
        }
    } catch (e) {
        console.error(e)
    }
}

function formatDate(date) {
    let options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
    };
    const formattedDate = date.toLocaleString('en-US', options);
    return formattedDate;
}

function sendMessage3(receivingUser) {

    const chatArea = document.getElementById('chat')
    const textArea = document.getElementById('textBox')
    const message = textArea.value.trimEnd().replace(/\n/g, "<br>")
    if (message != "") {
        const chatLog = document.createElement("div")
        let currentDate = formatDate(new Date())
        let currentUser = JSON.parse(localStorage.getItem("currentUser"))
        let messageDate = formatDate(currentDate)
        chatLog.innerHTML = `<span style='color: MediumBlue;'> ${currentUser.LoginName}</span> ` +
            `<span style='color:rgb(192, 192, 192);'>${messageDate}</span>:<br>` + message;

        const chatMessage = {
            userName: currentUser.LoginName,
            receivingUser: receivingUser,
            messageDate: messageDate,
            message: message,
            type: "send_message"
        };
        routeEvent(chatMessage)

        chatArea.appendChild(chatLog)

        textArea.value = "";
        textArea.placeholder = `Send ${receivingUser} a message!`
    }
    chatArea.scrollTo(0, chatArea.scrollHeight)
}
            // let data = await response.json();
