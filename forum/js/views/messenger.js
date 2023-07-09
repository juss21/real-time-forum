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
            createChat(element, userName);
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

function createChat(messageBox, userName) {
    if (document.getElementById("chat")) {
        document.getElementById("chat").remove()
    }

    const chat = document.createElement("div");
    chat.id = "chat";

    const textArea = document.createElement("textarea")

    textArea.id = "textBox"
    textArea.placeholder = `Send ${userName} a message!`;

    chat.appendChild(textArea)

    messageBox.appendChild(chat);
}