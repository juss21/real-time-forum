import { routeEvent, loadChat } from "../websocket.js";
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
            loadMessages(currentUser.LoginName, userName)
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


export function loadMessages(senderUser, receivingUser) {
const chatResponse = {
        userName: senderUser,
        receivingUser: receivingUser,
        type: "load_message"
    };
    loadChat(chatResponse)
}


export function createChat(receivingUser, previousMessages) {
    if (document.getElementById("chat")) {
        document.getElementById("chat").remove()
    }
    
    const chat = document.createElement("div");
    chat.id = "chat";
    previousMessages.forEach((message) => {
        const chatLog = document.createElement("div")
        chatLog.innerHTML = `<span style='color: MediumBlue;'> ${message.UserName}</span> ` +
        `<span style='color:rgb(192, 192, 192);'>${message.MessageDate}</span>:<br>` + message.Message;
        chat.appendChild(chatLog);
      });

    const textArea = document.createElement("textarea")
    textArea.id = "textBox"
    textArea.placeholder = `Send ${receivingUser} a message!`;
    textArea.maxLength = "10000"
    textArea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
            e.preventDefault();
            sendMessage(receivingUser);
            return
        }
    });
    const messageBox = document.getElementById('messageBox');

    chat.appendChild(textArea)
    messageBox.appendChild(chat);
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

function sendMessage(receivingUser) {

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
