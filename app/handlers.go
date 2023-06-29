package app

import (
	"fmt"
	"net/http"
	"text/template"
)

func createAndExecute(w http.ResponseWriter) {
	page, err := template.New("index.html").ParseFiles("web/templates/index.html")
	if err != nil {
		createAndExecuteError(w, "500 Internal Server Error")
		fmt.Println(err.Error())
		return
	}
	err = page.Execute(w, PageData)
	if err != nil {
		createAndExecuteError(w, "500 Internal Server Error")
		fmt.Println(err.Error())
		return
	}
}

func createAndExecuteError(w http.ResponseWriter, msg string) {
	page, _ := template.New("index.html").ParseFiles("web/templates/index.html")
	PageData.ErrorMsg = msg
	page.Execute(w, PageData)
	PageData.ErrorMsg = ""
}

func ServerHandle(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		w.WriteHeader(404)
		createAndExecuteError(w, "(404) Sorry but this page is not available!")
		return
	}

	if r.Method == "GET" {
		createAndExecute(w)
	}
}
