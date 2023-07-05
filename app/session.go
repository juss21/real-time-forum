package app

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"github.com/gofrs/uuid"
)

func LoginAttemptHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("Attempting to log in")
	var loginInfo LoginInfo
	err := json.NewDecoder(r.Body).Decode(&loginInfo)
	errorHandler(err)
	fmt.Println(loginInfo)


	var password string
	var userId int
	rows := DataBase.QueryRow("SELECT password, id FROM users WHERE username = ? OR email = ?", loginInfo.Login, loginInfo.Login)
	rows.Scan(&password, &userId)
	id, _ := uuid.NewV4()
	if loginInfo.Password == password && loginInfo.Password != "" {
		cookie := &http.Cookie{
			Name:    "session-id",
			Value:   id.String(),
		}
		http.SetCookie(w, cookie)
		SaveSession(cookie.Value, userId)

		err = json.NewEncoder(w).Encode(cookie)
		if err != nil {
			log.Println(err)
			return
		}
	} else {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("sitt login!"))
		return
	}
}

func SaveSession(key string, userId int) {
	DataBase.Exec("DELETE FROM session WHERE userId = ?", userId)

	statement, _ := DataBase.Prepare("INSERT INTO session (key, userId) VALUES (?,?)")
	_, err := statement.Exec(key, userId)
	if err != nil {
		fmt.Println("one per user")
	}
}

func LogoutAttemptHandler(w http.ResponseWriter, r *http.Request) {
	//if !Web.Loggedin {
		fmt.Println("SIIIIIIIN")
		cookie, _ := r.Cookie("session-id")
		DataBase.Exec("DELETE FROM session WHERE key = ?", cookie.Value)
		fmt.Println("TEHTUD")

		http.SetCookie(w, &http.Cookie{
			Name:   "session-id",
			Value:  "",
			MaxAge: -1,
		})
	//}
}