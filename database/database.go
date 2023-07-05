package sqldb

import (
	"io/ioutil"
	"log"

	"01.kood.tech/git/kasepuu/real-time-forum/app"
)

func InitDatabase() {
	file, err := ioutil.ReadFile("db.sql")
	if err != nil {
		log.Println(err)
	}

	app.DataBase.Exec(string(file))
}
