package app

import (
	"log"
	"net/http"
)

func StartServer(port string) {

	log.Printf("Starting server at port " + port + "\n\n")
	log.Printf("http://localhost:" + port + "/\n")

	http.Handle("/web/", http.StripPrefix("/web", http.FileServer(http.Dir("./web"))))
	http.HandleFunc("/", ServerHandle)

	errorHandler(http.ListenAndServe(":"+port, nil))
}

// error check
func errorHandler(err error) {
	if err != nil {
		log.Println(err)
		return
	}
}
