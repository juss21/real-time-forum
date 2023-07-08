export function createUserList(userData) {
    const messageBox = document.getElementById("messageBox");
    messageBox.innerHTML = "";

    for (let i = 0; i < userData.length; i++) {
        const userName = userData[i].UserName;
        const userNameElement = document.createElement("div");
        userNameElement.textContent = userName;
        messageBox.appendChild(userNameElement);
    }
}

export async function fetchUsers() {
    try {
        const url = "/get-users";
        const response = await fetch(url);

        if (response.ok) {
            let data = await response.json();
            createUserList(data)
        } else {
            console.log("Failed to fetch user data.");
        }
    } catch (e) {
        console.error(e);
    }
}

