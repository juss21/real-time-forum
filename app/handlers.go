package app

import (
	"encoding/json"
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
	log.Println("Home!")

}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	createAndExecuteTemplate(w, r)
	var loginInfo LoginInfo
	err := json.NewDecoder(r.Body).Decode(loginInfo)
	errorHandler(err)

	log.Println("login!")

}

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	createAndExecuteTemplate(w, r)
	log.Println("register!")

}
