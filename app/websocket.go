package app

import (
	"encoding/json"
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

		var chatMessage ChatMessage

		err = json.Unmarshal(message, &chatMessage)
		errorHandler(err)

		if err := conn.WriteMessage(messageType, message); err != nil {
			log.Println(err)
			return
		}


		//parem systeem siia
		SaveChat(chatMessage.ReceivingUser, chatMessage.UserName, chatMessage.MessageDate, chatMessage.Message)

		returnData(chatMessage.ReceivingUser, chatMessage.UserName)

		response := map[string]string{
            "response_type":    "response",
            "response_payload": "Received your message",
        }
        responseData, err := json.Marshal(response)
        if err != nil {
            log.Println(err)
            return
        }

        if err := conn.WriteMessage(messageType, responseData); err != nil {
            log.Println(err)
            return
        }
	}
}
