package app

import (
	"fmt"
	"io/ioutil"
	"log"
)

func InitDatabase() {
	file, err := ioutil.ReadFile("db.sql")
	if err != nil {
		log.Println(err)
	}
	fmt.Println("ok")
	DataBase.Exec(string(file))
}

func SessionCleanup() {
	DataBase.Exec("DELETE FROM session")
}
