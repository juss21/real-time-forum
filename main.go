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
	db, err := sql.Open("sqlite3", "database/database.db")
	if err != nil {
		fmt.Println("Error opening the database:", err)
		return
	}
	defer db.Close()

	// fetching port from templates folder
	portFromFile, err := os.ReadFile("forum/port.txt")
	firstlineCheck := StringControl(string(strings.Split(string(portFromFile), "\n")[0]))
	port := string(strings.Split(string(portFromFile), "\n")[0]) //port value
	if err != nil || !firstlineCheck {
		fmt.Println("path: /forum/port.txt")
		fmt.Println("<port.txt> file not found or corrupt, please enter port for webserver manually:")
		fmt.Scanln(&port)
	}

	// if .db file deleted, it will create new one and populate with data
	if errors.Is(err, os.ErrNotExist) {
		app.DataBase, _ = sql.Open("sqlite3", "database/database.db")
		app.InitDatabase()
		defer app.DataBase.Close()
		fmt.Println("New database created ")
	} else {
		var errr error
		app.DataBase, errr = sql.Open("sqlite3", "database/database.db")
		fmt.Println(errr)
		defer app.DataBase.Close()
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
