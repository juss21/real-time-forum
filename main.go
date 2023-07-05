package main

import (
	"database/sql"
	"errors"
	"fmt"
	"os"
	"strings"

	"01.kood.tech/git/kasepuu/real-time-forum/app"
	_ "github.com/mattn/go-sqlite3"
)

func main() {
	file, dberr := os.Stat("database/database.db")

	// fetching port from templates folder
	portFromFile, err := os.ReadFile("forum/port.txt")
	firstlineCheck := StringControl(string(strings.Split(string(portFromFile), "\n")[0]))
	port := string(strings.Split(string(portFromFile), "\n")[0]) //port value
	if err != nil || !firstlineCheck {
		fmt.Println("path: /forum/port.txt")
		fmt.Println("<port.txt> file not found or corrupt, please enter port for webserver manually:")
		fmt.Scanln(&port)
	}

	// if .db file deleted, it will create new one and populate it with data
	if errors.Is(dberr, os.ErrNotExist) {
		app.DataBase, _ = sql.Open("sqlite3", "database/database.db")
		app.InitDatabase()
		fmt.Println("New database created ", file)
	} else {
		app.DataBase, _ = sql.Open("sqlite3", "/database.db")
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
