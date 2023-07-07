package app

import (
	"net/http"
)

func HomePageHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "./forum/index.html")
}
