package app

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gofrs/uuid"
)

func getUserId(loginInput string) (userId int) {
	DataBase.QueryRow("SELECT id FROM users WHERE username = ? OR email = ?", loginInput, loginInput).Scan(&userId)

	return userId
}

func createCookie(w http.ResponseWriter, loginInput string) string {
	userid := getUserId(loginInput)

	session := uuid.Must(uuid.NewV4()).String()
	http.SetCookie(w, &http.Cookie{
		Name:   "session-" + strconv.Itoa(userid),
		Value:  session,
		MaxAge: int(12 * time.Hour),
	})

	DataBase.Exec("DELETE FROM session WHERE userId = ?", userid)
	db, err := DataBase.Prepare("INSERT INTO session (key, userid) VALUES (?,?)")
	errorHandler(err)

	db.Exec(session, userid)

	return session
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("Attempting to log in")

	var loginInfo LoginInfo
	err := json.NewDecoder(r.Body).Decode(&loginInfo)
	errorHandler(err)
	fmt.Println(loginInfo)

	var password string
	var userId int
	rows := DataBase.QueryRow("SELECT password, id FROM users WHERE username = ? OR email = ?", loginInfo.Login, loginInfo.Login)
	scanErr := rows.Scan(&password, &userId)

	// on bad password
	if loginInfo.Password != password || scanErr != nil {
		log.Println("Login was a fail!")
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("sitt login!"))
		return
	}

	// on success
	log.Println("Login was successful!")

	response := loginMessage{
		LoginName: loginInfo.Login,
		UserID:    getUserId(loginInfo.Login),
		CookieKey: createCookie(w, loginInfo.Login),
	}

	w.WriteHeader(http.StatusOK)

	err = json.NewEncoder(w).Encode(response)
	if err != nil {
		log.Println(err)
		return
	}

}

func LogoutHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("Attempting to log out")
	userId := r.URL.Query().Get("UserID")

	http.SetCookie(w, &http.Cookie{
		Name:   "session-" + userId,
		Value:  "0",
		MaxAge: -1,
	})

	_, err := DataBase.Exec("DELETE FROM session WHERE userId = ?", userId)
	errorHandler(err)

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Logout was successful!"))

}

func HasCookieHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("Attempting to authorize")
	key := r.URL.Query().Get("CookieKey")
	uid := r.URL.Query().Get("UserID")
	fmt.Println(key, "\n", uid)

	var hasCookie bool
	err := DataBase.QueryRow("SELECT EXISTS(SELECT 1 FROM session WHERE key = ? AND userId = ?)", key, uid).Scan(&hasCookie)
	errorHandler(err)

	if hasCookie {
		log.Println("Authorization was OK")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Session for user, has been found!"))
	} else {
		log.Println("Authorization was a Fail")
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte("Session for user, NOT FOUND!"))
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
