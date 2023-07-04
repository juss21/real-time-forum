package app

import (
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"net/http"
)

func createAndExecuteTemplate(w http.ResponseWriter, r *http.Request) {
	temp, err := template.ParseFiles("./forum/index.html")
	if err != nil {
		http.Redirect(w, r, "/", http.StatusInternalServerError)
	}
	err = temp.Execute(w, nil)
	if err != nil {
		http.Redirect(w, r, "/", http.StatusInternalServerError)
	}
}

func HomePageHandler(w http.ResponseWriter, r *http.Request) {
	createAndExecuteTemplate(w, r)

}

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
