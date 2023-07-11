// WEBSOCKET

export function wsAddConnection() {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"))
    let socket = new WebSocket(`ws://${document.location.host}/ws?UserID=${currentUser}`)

    socket.onopen = () => {
        console.log("WebSocket Connection established!")
    }

    socket.onmessage = (e) => {
        if (e.data) {
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
    "load_message": loadData,
};

export function routeEvent(data) {
    console.log("routeEvent data: ", data)
    if (data.type === undefined || !functionMap[data.type](data)) {
        return
    }
    functionMap[data.type](data);
}

function loadData() {
    console.log("Messages Loaded :)")
}

export function sendData(data) {
    socket.send(JSON.stringify(data));
}