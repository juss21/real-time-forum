package main

import (
	"fmt"
	"os"
	"strings"

	"01.kood.tech/git/kasepuu/real-time-forum/app"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func main() {

	// fetching port from templates folder
	portFromFile, err := os.ReadFile("web/templates/port.txt")
	firstlineCheck := StringControl(string(strings.Split(string(portFromFile), "\n")[0]))
	port := string(strings.Split(string(portFromFile), "\n")[0]) //port value
	if err != nil || !firstlineCheck {
		fmt.Println("path: /game/templates/port.txt")
		fmt.Println("<port.txt> file not found or corrupt, please enter port for webserver manually:")
		fmt.Scanln(&port)
	}

	app.StartServer(port) // server
}

// function that checks string for letters
func StringControl(str string) bool {
	success := false
	for i := 0; i < len(str); i++ {
		if rune(str[i]) < '0' || rune(str[i]) > '9' {
			success = false
		} else {
			success = true
		}
	}
	return success
}
