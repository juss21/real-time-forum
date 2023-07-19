package sqlDB

import (
	"database/sql"
	"io/ioutil"
	"log"
)

var DataBase *sql.DB

func InitDatabase() {
	file, err := ioutil.ReadFile("database.sql")
	if err != nil {
		log.Println(err)
	}
	DataBase.Exec(string(file))
}

func SessionCleanup() {
	DataBase.Exec("DELETE FROM session")
}
