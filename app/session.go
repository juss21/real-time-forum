package app

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	//"strings"
)

func LoginAttemptHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("Attempting to log in")
	var loginInfo LoginInfo
	err := json.NewDecoder(r.Body).Decode(&loginInfo)
	errorHandler(err)
	fmt.Println(loginInfo)


	var password string
	rows := DataBase.QueryRow("SELECT password FROM users WHERE username = ? OR email = ?", loginInfo.Login, loginInfo.Login)
	rows.Scan(&password)
	if loginInfo.Password == password && loginInfo.Password != "" {
		response := loginMessage{
			Name:    "Testike",
			UID:     "3",
			Message: "terekest!",
		}

		err = json.NewEncoder(w).Encode(response)
		if err != nil {
			log.Println(err)
			return
		}
	} else {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("sitt login!"))
		return
	}
}

func CookieCheckHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("Cookie check!")
	//cockieId := r.URL.Query().Get("cookieId")

}
