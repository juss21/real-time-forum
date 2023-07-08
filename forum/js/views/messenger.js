export function createUserList(id, userData) {
    const element = document.getElementById(id);
    element.innerHTML = "";

    for (let i = 0; i < userData.length; i++) {
        const userName = userData[i].UserName;
        const userNameElement = document.createElement("div");
        userNameElement.textContent = userName;
        element.appendChild(userNameElement);
    }
}

export async function fetchUsers(id) {
    try {
        const url = "/get-users";
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

