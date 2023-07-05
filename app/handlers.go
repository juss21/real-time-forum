package app

import (
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
}
