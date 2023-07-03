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

var savedSockets []*Client

func WebsocketHandler(w http.ResponseWriter, r *http.Request) {

	upgrader.CheckOrigin = func(r *http.Request) bool { return true }

	log.Println("Websocket request!")
	if savedSockets == nil {
		savedSockets = make([]*Client, 0)
	}

	defer func() {
		err := recover()
		if err != nil {
			log.Println(err)
		}
		r.Body.Close()
	}()

	connection, err := upgrader.Upgrade(w, r, nil)
	errorHandler(err)

	socketReader := &Client{
		ws: connection,
	}

	savedSockets = append(savedSockets, socketReader)

	// handling incoming messages
	socketReader.wsReader(r)
}

func (c *Client) wsReader(r *http.Request) {
	for {
		_, message, err := c.ws.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway) {
				fmt.Println("WebSocket connection closed")
			} else if err == websocket.ErrCloseSent {
				fmt.Println("WebSocket connection closed by client")
			} else {
				errorHandler(err)
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
			c.ws.WriteMessage(websocket.TextMessage, []byte(loginReply))
			doLogin(jsonData["login_id"], jsonData["login_pw"])
		case "register":
			// register here
			fmt.Println("register! (nupp 2)")
		}

		c.ws.WriteJSON(PageData)
	}
}

func doLogin(user, password string) {
	fmt.Println("login! (nupp 1)")

	fmt.Println(user)
	fmt.Println(password)
}
