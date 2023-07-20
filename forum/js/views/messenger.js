import { routeEvent, loadChat, sendEvent } from "../websocket.js";
import { hasSession } from "../helpers.js";

let messageBox;
let limit = 0;
let scrolling = false;
let scrollEnd = false;
let prevScrollHeight;

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
            localStorage.setItem("CurrentChat", userName)
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


export function displayMessages(receivingUser, senderName, previousMessages) {

    const currentUser = JSON.parse(localStorage.getItem("currentUser"))
    const CurrentChat = localStorage.getItem("CurrentChat")

    const chatLog = document.getElementById('chatLog')

    if (chatLog) {
        chatLog.innerHTML = "";
    }

    if (CurrentChat != receivingUser || !chat) {
        //EXECUTE NOTIFICATION!
        return
    }
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
            //if ((loadedMessage.UserName === currentUser.LoginName || chat.scrollTop + chat.clientHeight >= chat.scrollHeight - 100) && !scrolling) chat.scrollTo(0, chat.scrollHeight);
        });
    }
    //if (previousMessages && previousMessages.length > 1 && !scrolling) chat.scrollTo(0, chat.scrollHeight)

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
    }
    limit = 10

    const chat = document.createElement("div");
    chat.id = "chat";
    loadAllMessages(currentUser, receivingUser, limit)

    const chatLog = document.createElement("div")
    chatLog.id = "chatLog"
    chatLog.addEventListener('scroll', (e) => {
        //chat.innerHTML = ""
        //chat.appendChild(createTextArea(currentUser, receivingUser))
        throttle(loadAdditionalMessages(currentUser, receivingUser))
    })
    const textArea = createTextArea(currentUser, receivingUser)

    const messageBox = document.getElementById('messageBox');
    chat.appendChild(textArea)
    chat.appendChild(chatLog)

    messageBox.appendChild(chat);
}

function createTextArea(currentUser, receivingUser) {
    const textArea = document.createElement("textarea")
    textArea.id = "textBox"
    textArea.placeholder = `Send ${receivingUser} a message!`;
    textArea.maxLength = "10000"
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
            // let data = await response.json();
            // createUserList(id, data)
            loadMessage(Sender, Receiver, 1)
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