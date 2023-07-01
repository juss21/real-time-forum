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
	go wsReader(conn, r)
}

func wsReader(conn *websocket.Conn, r *http.Request) {
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
			fmt.Println(r.FormValue("login_id"))
			fmt.Println(r.FormValue("login_pw"))
			message := loginMessage{
				Action:  "Login",
				Name:    jsonData["login_id"],
				Message: "Willkommen, " + jsonData["login_id"] + "!",
			}
			loginReply, err := json.Marshal(message)
			errorHandler(err)
			conn.WriteMessage(websocket.TextMessage, []byte(loginReply))
			doLogin(jsonData["login_id"], jsonData["login_pw"])
		case "register":
			// register here
			fmt.Println("register! (nupp 2)")
		}

		conn.WriteJSON(PageData)
	}
}

func doLogin(user, password string) {
	fmt.Println("login! (nupp 1)")

	fmt.Println(user)
	fmt.Println(password)
}
