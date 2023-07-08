package app

import (
	"encoding/json"
	"log"
	"net/http"
)

func getAllUsers() (users []User) {
	rows, _ := DataBase.Query("SELECT id, username FROM users")
	defer rows.Close()
	for rows.Next() {
		var user User
		rows.Scan(&user.UserID, &user.UserName)
		users = append(users, user)
	}
	return
}

func sendUserList(w http.ResponseWriter, r *http.Request) {
	userList := getAllUsers()
	w.WriteHeader(http.StatusOK)
	err := json.NewEncoder(w).Encode(userList)
	if err != nil {
		log.Println(err)
		return
	}
}

func PostsHandler(w http.ResponseWriter, r *http.Request) {

}
