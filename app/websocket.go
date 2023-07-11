package app

import (
	"encoding/json"
	"log"
	"net/http"
	"regexp"
	"github.com/gorilla/websocket"
)

//FUNction manager :)

func dataManager(data string, conn *websocket.Conn) {
	re := regexp.MustCompile(`"type":"([^"]+)"`)
	match := re.FindStringSubmatch(data)
	if len(match) > 1 {
		result := match[1]

		functionMap := map[string]func(data string, conn *websocket.Conn){
			"send_message": decipherMessage,
			"load_message": sendMessage,
		}

		if function, ok := functionMap[result]; ok {
			function(data, conn)
		}
	}
}

func decipherMessage(data string, conn *websocket.Conn) {
	if string(data) != "undefined" {
		//parem systeem siia
		var chatMessage ChatMessage

		err2 := json.Unmarshal([]byte(data), &chatMessage)
		if err2 != nil {
			log.Println(err2)
			return
		}
		if err3 := conn.WriteMessage(1, []byte(data)); err3 != nil {
			log.Println(err3)
			return
		}

		userID := getUserIdFomMessage(chatMessage.UserName)
		receivingID := getUserIdFomMessage(chatMessage.ReceivingUser)

		SaveChat(userID, receivingID, chatMessage.MessageDate, chatMessage.Message)
	} 
}

func sendMessage(data string, conn *websocket.Conn) {
 /*        response := map[string]string{
            "response_type":    "response",
            "response_payload": "Received your message",
        }
        responseData, err := json.Marshal(response)
        if err != nil {
            // Handle the error
            log.Println(err)
            return
        }

        if err := conn.WriteMessage(messageType, responseData); err != nil {
            // Handle the error
            log.Println(err)
            return
        }
		*/
}

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
		_, message, err := conn.ReadMessage()
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
		dataManager(string(message), conn)
	}
}
