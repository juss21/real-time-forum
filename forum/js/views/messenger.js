import { routeEvent, loadChat, sendEvent } from "../websocket.js";
import { hasSession } from "../helpers.js";

let messageBox;
let limit = 0;
let scrolling = false;
let scrollEnd = false;
let prevScrollHeight;

export function openMessenger() {
    messageBox = document.getElementById("messageBox")
    createMessageBox(messageBox)
    updateUserList(JSON.parse(sessionStorage.getItem("CurrentUser")).LoginName)
    let openButton = document.getElementById("openButton")
    openButton.style.display = "none";
    messageBox.style.display = "block";
}

export function createMessageBox(element) {
    element.innerHTML = "";
    createCloseButton(element)
}

export function createUserList(userData, element) {
    if (document.getElementById("userList")) {
        document.getElementById("userList").remove()
    }

    const userList = document.createElement('div');
    userList.className = "messageUsers";
    userList.id = "userList"
    let currentUser = JSON.parse(sessionStorage.getItem("CurrentUser"))

    for (let i = 0; i < userData.length; i++) {
        const userName = userData[i].UserName;
        const userNameElement = document.createElement("div");
        userNameElement.textContent = userName;
        userNameElement.id = userName
        userNameElement.className = "username"

        if (userData[i].Status) userNameElement.style.color = "yellow"
        else userNameElement.style.color = "green"

        if (localStorage.getItem("CurrentChat")) createChat(currentUser.LoginName, localStorage.getItem("CurrentChat"))

        userNameElement.addEventListener("click", () => {
            localStorage.setItem("CurrentChat", userName)
            createChat(currentUser.LoginName, userName)
        });
        userList.appendChild(userNameElement)
    }
    element.appendChild(userList)
}

function createCloseButton(element) {
    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.type = "button";
    closeButton.className = "cancel";

    closeButton.addEventListener("click", () => {
        let openButton = document.getElementById("openButton")
        localStorage.removeItem("CurrentChat")
        element.style.display = "none";
        openButton.style.display = "block";
    });
    element.appendChild(closeButton);
}

export function loadAllMessages(senderUser, receivingUser, limit) {
    const chatResponse = {
        userName: senderUser,
        receivingUser: receivingUser,
        limit: limit
    };
    sendEvent("load_all_messages", chatResponse)
}

export function loadMessage(senderUser, receivingUser, limit) {
    const chatResponse = {
        userName: senderUser,
        receivingUser: receivingUser,
        limit: limit
    };
    sendEvent("load_message", chatResponse)
}

export function updateUserList(senderUser, receivingUser = "") {
    const chatResponse = {
        userName: senderUser,
        receivingUser: receivingUser,
        limit: 1
    };
    sendEvent("update_users", chatResponse)
}

export function displayNotification(sender, receiver) {
    if (sender) {
        let message = `You received a message from ${sender}!`
        notificationHTML(message, sender)
    }
}

function notificationHTML(message, sender) {
    const notificationDIV = document.createElement("div")
    notificationDIV.className = "notificationBar"

    const notificationMessage = document.createElement("div")
    notificationMessage.className = "notificationMessage"
    notificationDIV.appendChild(notificationMessage)

    const closeNotification = document.createElement("button")
    closeNotification.id = "notificationBNT"
    closeNotification.innerHTML = "X"
    notificationDIV.appendChild(closeNotification)

    const textMessage = document.createElement("h1")
    textMessage.innerHTML = message
    notificationMessage.appendChild(textMessage)


    closeNotification.addEventListener("click", () => {
        notificationDIV.remove()
    })

    notificationMessage.addEventListener("click", () => {
        console.log("kliklik")
        if (!localStorage.getItem("CurrentChat")) localStorage.setItem("CurrentChat", sender)
        else localStorage.setItem("CurrentChat", sender)
        openMessenger()
        notificationDIV.remove();
    })


    document.getElementById("app").appendChild(notificationDIV)


    // Set a timeout to remove the notification after 10 seconds
    setTimeout(function () {
        notification.remove();
    }, 7000); // 10000 milliseconds = 10 seconds
}

export function displayIsWriting(sender, receiver) {
    const currentUser = JSON.parse(sessionStorage.getItem("CurrentUser"))
    const CurrentChat = localStorage.getItem("CurrentChat")
    const chatStatus = document.getElementById("chat-status")

    const chat = document.getElementById('chat')
    console.log("writing?")
    if (!chatStatus) return
    if (receiver === currentUser.LoginName) { console.log("receiver on prg kasutaja", receiver, currentUser.LoginName); chatStatus.innerHTML = ""; return }
    if (CurrentChat !== receiver || !chat) { console.log("currentchat on vale!", CurrentChat, sender); chatStatus.innerHTML = ""; return }

    let messageformat = `📱${receiver} is typing...`

    chatStatus.innerHTML = messageformat

     // Set a timeout to remove the notification after 10 seconds
     setTimeout(function () {
        chatStatus.innerHTML = ""
    }, 2000); // 10000 milliseconds = 10 seconds
    console.log("sending to:", sender)
    console.log("receiver:", receiver)
}

export function displayMessages(receivingUser, senderName, previousMessages, loadall = false) {

    const currentUser = JSON.parse(sessionStorage.getItem("CurrentUser"))
    const CurrentChat = localStorage.getItem("CurrentChat")

    const chat = document.getElementById('chat')
    const chatLog = document.getElementById('chatLog')
    if (chatLog) {
        chatLog.className = "messages"
    }
    if (chatLog && scrolling) {
        chatLog.innerHTML = "";
    }

    if ((CurrentChat != receivingUser || !chat) && !loadall) {
        displayNotification(receivingUser, currentUser.LoginName)
        return
    }
    if (!chat) return

    if (previousMessages) {
        previousMessages.forEach((loadedMessage) => {
            const message = document.createElement("div");
            message.id = "message";

            if (loadedMessage.UserName === currentUser.LoginName) {
                message.className = "messenger_currentUser";
                message.innerHTML =
                    `<span class="dateColor">${loadedMessage.MessageDate}</span> ` +
                    `<span class="nameColor">${loadedMessage.UserName}</span> <span class="separatorColor">:</span> ` +
                    `<span class="messageColor">${loadedMessage.Message}</span>`;
            } else {
                message.className = "messenger_receivingUser";
                message.innerHTML =
                    `<span class="dateColor">${loadedMessage.MessageDate}</span> ` +
                    `<span class="nameColor">${loadedMessage.UserName}</span> <span class="separatorColor">:</span> ` +
                    `<span class="messageColor">${loadedMessage.Message}</span>`;
            }
            chatLog.appendChild(message);
        });
    }
    if (!scrolling) {
        chatLog.scrollTop = chatLog.scrollHeight
    } else {
        chatLog.scrollTop = chatLog.scrollHeight - prevScrollHeight
        if (limit > previousMessages.length) {
            scrollEnd = true
        }
        scrolling = false
    }
}

export function createChat(currentUser, receivingUser) {
    if (document.getElementById("chat")) {
        document.getElementById("chat").remove()
        scrolling = false;
        scrollEnd = false;
        prevScrollHeight = 0
    }
    limit = 10

    const chat = document.createElement("div");
    chat.id = "chat";

    const title = document.createElement("div")
    title.id = "chat-title";
    title.innerHTML = `📪${receivingUser}`
    chat.appendChild(title)

    loadAllMessages(currentUser, receivingUser, limit)

    const chatLog = document.createElement("div")
    chatLog.id = "chatLog"
    chatLog.addEventListener('scroll', (e) => {
        throttle(loadAdditionalMessages(currentUser, receivingUser))
    })
    const textArea = createTextArea(currentUser, receivingUser)

    const status = document.createElement("div")
    status.id = "chat-status"
    status.innerHTML = ""

    const messageBox = document.getElementById('messageBox');
    chat.appendChild(textArea)
    chat.appendChild(chatLog)

    chat.appendChild(status)

    messageBox.appendChild(chat);

}

function createTextArea(currentUser, receivingUser) {
    const textArea = document.createElement("textarea")
    textArea.id = "textBox"
    textArea.placeholder = `Send ${receivingUser} a message!`;
    textArea.maxLength = "10000"

    textArea.addEventListener('input', (e) => {
        const response = {
            currentUser: currentUser,
            receivingUser: receivingUser,
        }
        sendEvent("is_typing", response)
    })

    textArea.addEventListener('keydown', (e) => {

        if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
            e.preventDefault();
            limit++
            console.log("Enter keypress>", currentUser, receivingUser)
            sendMessage(textArea.value, currentUser, receivingUser) // send message to server
            //createChat(currentUser, receivingUser)
            textArea.value = "";

            return
        }
    });
    return textArea
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
            loadMessage(Sender, Receiver, 1)
            updateUserList(Sender, Receiver)
        } else {
            console.log("Failed to fetch user data.");
        }
    } catch (e) {
        console.error(e)
    }
}


const loadAdditionalMessages = (currentUser, receivingUser) => {
    if (document.getElementById("chatLog").scrollTop === 0 && !scrollEnd) {
        limit += 10
        prevScrollHeight = document.getElementById("chatLog").scrollHeight
        loadAllMessages(currentUser, receivingUser, limit)
        scrolling = true
    }
}

function throttle(func, wait) {
    var lastEvent = 0
    return function () {
        var currentTime = new Date()
        if (currentTime - lastEvent > wait) {
            func.apply(this, arguments)
            lastEvent = currentTime
        }
    }
}