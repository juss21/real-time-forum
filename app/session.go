package app

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

func LoginAttemptHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("Attempting to log in")
	var loginInfo LoginInfo
	err := json.NewDecoder(r.Body).Decode(&loginInfo)
	errorHandler(err)
	fmt.Println(loginInfo)

	if loginInfo.Login != "" || loginInfo.Password != "" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("sitt login!"))
		return
	} else {
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
	}

}

func CookieCheckHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("Cookie check!")
	//cockieId := r.URL.Query().Get("cookieId")

}
