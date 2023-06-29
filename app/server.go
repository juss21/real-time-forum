package app

import (
	"log"
	"net/http"
)

func StartServer(port string) {

	http.Handle("/forum/", http.StripPrefix("/forum", http.FileServer(http.Dir("./game"))))
	http.HandleFunc("/", ServerHandle)

	log.Printf("Starting server at port " + port + "\n\n")
	log.Printf("http://localhost:" + port + "/\n")
	errorHandler(http.ListenAndServe(":"+port, nil))
}

// error check
func errorHandler(err error) {
	if err != nil {
		log.Println(err)
		return
	}
}
