package main

import (
	"database/sql"
	"errors"
	"fmt"
	"os"
	"strconv"

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

	port := getPort()

	// if .db file deleted, it will create new one and populate with data
	if errors.Is(err, os.ErrNotExist) {
		app.DataBase, _ = sql.Open("sqlite3", "database/database.db")
		app.InitDatabase()
		defer app.DataBase.Close()
		fmt.Println("New database created ")
	} else {
		app.DataBase, _ = sql.Open("sqlite3", "database/database.db")
		defer app.DataBase.Close()
	}

	app.StartServer(port) // server
}

// function that checks string for letters
func getPort() (port string) {
	defaultPort := "8080"
	if len(os.Args) > 1 {
		port, err := strconv.Atoi(os.Args[1])
		if err == nil {
			defaultPort = strconv.Itoa(port)
		}
	}

	return defaultPort
}
