package app

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

// WEBSOCKET

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

// websocket client
func wsEndpoint(w http.ResponseWriter, r *http.Request) {
	log.Println("Websocket request!")
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }

	connection, err := upgrader.Upgrade(w, r, nil)
	errorHandler(err)

	log.Println("Client Successfully connected!")

	wsReader(connection)
}

func wsReader(conn *websocket.Conn) {
	for {
		messageType, message, err := conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway) {
				log.Println("WebSocket connection closed")
			} else if err == websocket.ErrCloseSent {
				log.Println("WebSocket connection closed by the client")
			} else {
				log.Println(err)
			}
			return
		}

		fmt.Println("Type:", string(messageType))
		fmt.Println(string(message))
		var jsonData map[string]string // json string map
		err = json.Unmarshal(message, &jsonData)
		errorHandler(err)

		switch jsonData["action"] {
		case "login":
			doLogin(jsonData["login_id"], jsonData["login_pw"])
		case "register":
			fmt.Println("register! (nupp 2)")
		}

		if err := conn.WriteMessage(messageType, message); err != nil {
			log.Println(err)
			return
		}
	}
}

func doLogin(user, password string) {
	fmt.Println("login! (nupp 1)")

	fmt.Println(user)
	fmt.Println(password)
}
