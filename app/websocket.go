package app

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
)

// WEBSOCKET

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

type socket struct {
}

func WebsocketHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Websocket request received!")

	upgrader.CheckOrigin = func(r *http.Request) bool { return true }

	conn, err := upgrader.Upgrade(w, r, nil)
	errorHandler(err)

	// handling incoming messages
	go wsReader(conn)
}

func wsReader(conn *websocket.Conn) {
	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway) {
				fmt.Println("WebSocket connection closed")
			} else if err == websocket.ErrCloseSent {
				fmt.Println("WebSocket connection closed by client")
			} else {
				fmt.Println("Error reading message!")
			}
			return
		}

		fmt.Println(string(message))

		var jsonData map[string]string // json string map
		err = json.Unmarshal(message, &jsonData)

		if err != nil {
			fmt.Println("Error decoding JSON")
		}

		switch jsonData["action"] {
		case "login":
			// login here
			fmt.Println("login! (nupp 1)")
		case "register":
			// register here
			fmt.Println("register! (nupp 2)")
		}

		conn.WriteJSON(PageData)
	}
}
