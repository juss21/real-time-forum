let host = "localhost"

// WEBSOCKET
class Client {
    constructor() {
        this.mysocket = null
    }

    // establishing a connection between browser & server
    connect() {
        let ws = new WebSocket(`ws://${document.location.host}/ws`)

        this.mysocket = ws

        ws.onopen = () => {
            console.log("WebSocket Connection established!")
        }
        ws.onmessage = (e) => {
            console.log("Message recieved!")
        }
        ws.onclose = (e) => {
            console.log("WebSocket connection Lost!", e)
        }
    } catch(error) {
        console.log("Error:", error)
    }
}