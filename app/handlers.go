package app

import (
	"fmt"
	"net/http"
)

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("login!")
}

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("register!")
}
