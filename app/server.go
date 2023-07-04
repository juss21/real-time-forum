package app

import (
	"log"
	"net/http"
	"strings"
)

func StartServer(port string) {

	fs := noDirListing(http.FileServer(http.Dir("./forum/"))) //nodirlisting to avoid guest seeing all files stored in /web/images/

	log.Printf("Starting server at port " + port + "\n\n")
	log.Printf("http://localhost:" + port + "/\n")

	http.Handle("/forum/", http.StripPrefix("/forum", fs)) // handling forum file
	http.HandleFunc("/ws", wsEndpoint)
	http.HandleFunc("/", HomePageHandler)
	http.HandleFunc("/login", LoginHandler)
	http.HandleFunc("/register", RegisterHandler)

	errorHandler(http.ListenAndServe(":"+port, nil))
}

// error check
func errorHandler(err error) {
	if err != nil {
		log.Println(err)
		return
	}
}

func noDirListing(h http.Handler) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if strings.HasSuffix(r.URL.Path, "/") {
			w.WriteHeader(http.StatusForbidden)
			return
		}
		h.ServeHTTP(w, r)
	})
}
