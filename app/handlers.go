package app

import (
	"fmt"
	"html/template"
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
	fmt.Println("Home!")

}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	createAndExecuteTemplate(w, r)
	fmt.Println("login!")

}

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	createAndExecuteTemplate(w, r)
	fmt.Println("register!")

}
