package main

import (
	"database/sql"
	"errors"
	"fmt"
	"os"
	"strconv"

	"01.kood.tech/git/kasepuu/real-time-forum/app"
	sqlDB "01.kood.tech/git/kasepuu/real-time-forum/database"

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
		sqlDB.DataBase, _ = sql.Open("sqlite3", "database/database.db")
		sqlDB.InitDatabase()
		defer sqlDB.DataBase.Close()
		fmt.Println("New database created ")
	} else {
		sqlDB.DataBase, _ = sql.Open("sqlite3", "database/database.db")
		defer sqlDB.DataBase.Close()
	}

	app.StartServer(port) // server
}

func getPort() string {
	serverPort := "8080" // 8080 port by default
	if len(os.Args) > 1 {
		port, err := strconv.Atoi(os.Args[1])
		if err == nil {
			serverPort = strconv.Itoa(port)
		}
	}
	return serverPort
}
