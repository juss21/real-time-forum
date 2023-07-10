// everything related to login/logout, sessions...
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
func getUserName(userId int) (UserName string) {
	DataBase.QueryRow("SELECT username FROM users WHERE id = ?", userId).Scan(&UserName)
	return UserName
}
func getCategoryFromID(id int) (category string) {
	DataBase.QueryRow("SELECT name FROM category WHERE id = ?", id).Scan(&category)
	return category
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

	response := LoginResponse{
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
func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("Attempting to register")

	var registerInfo RegisterInfo
	err := json.NewDecoder(r.Body).Decode(&registerInfo)
	errorHandler(err)

	var nicknameB, emailB bool

	err1 := DataBase.QueryRow("SELECT EXISTS (SELECT 1 FROM users WHERE lower(username) = lower(?))", registerInfo.Username).Scan(&nicknameB)
	err2 := DataBase.QueryRow("SELECT EXISTS (SELECT 1 FROM users WHERE lower(email) = lower(?))", registerInfo.Email).Scan(&emailB)

	fmt.Println(nicknameB, emailB)

	if err1 == nil && err2 == nil {
		if emailB || nicknameB {
			responseMessage := ""
			if emailB {
				responseMessage = "email"
			}
			if nicknameB {
				responseMessage = "name"
			}
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("Bad register attempt!" + responseMessage))
			return
		} else {
			row, err := DataBase.Prepare("INSERT INTO users (username, password, email, age, gender, firstname, lastname) VALUES (?, ?, ?, ?, ?, ?, ?)")
			if err != nil {
				log.Println(err)
				return
			}

			_, erro := row.Exec(registerInfo.Username, registerInfo.Password, registerInfo.Email, registerInfo.Age, registerInfo.Gender, registerInfo.FirstName, registerInfo.LastName)
			if erro != nil {
				log.Println(erro)
				return
			}

			w.WriteHeader(http.StatusOK)
			w.Write([]byte("Registration was successful!"))
		}
	} else {
		log.Println(err1)
		log.Println(err2)
		return
	}
}

func LogoutHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("Attempting to log out")
	userId := r.URL.Query().Get("UserID")
	currentSession := "session-" + userId
	fmt.Println(userId, currentSession)
	http.SetCookie(w, &http.Cookie{
		Name:   currentSession,
		Value:  "0",
		MaxAge: -1,
	})

	_, err := DataBase.Exec("DELETE FROM session WHERE userId = ?", userId)
	errorHandler(err)

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Logout was successful!"))

}

func HasCookieHandler(w http.ResponseWriter, r *http.Request) {
	key := r.URL.Query().Get("CookieKey")
	uid := r.URL.Query().Get("UserID")

	var hasCookie bool
	err := DataBase.QueryRow("SELECT EXISTS(SELECT 1 FROM session WHERE key = ? AND userId = ?)", key, uid).Scan(&hasCookie)
	errorHandler(err)

	if hasCookie {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Session for user, has been found!"))
	} else {
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

func returnData(RecUser string, User string) {

}

func SaveChat(RecUser string, User string, DateSent string, Message string) {
	
	var userID, receiverID int
	err := DataBase.QueryRow("SELECT id FROM users WHERE username = ?", User).Scan(&userID)
	err3 := DataBase.QueryRow("SELECT id FROM users WHERE username = ?", RecUser).Scan(&receiverID)
	if err != nil || err3 != nil {
		log.Println(err, err3)
	}

	statement, _ := DataBase.Prepare("INSERT INTO chat (userid, receiverid, datesent, message) VALUES (?,?,?,?)")
	_, err2 := statement.Exec(userID, receiverID, DateSent, Message)
	if err2 != nil {
		fmt.Println("Error saving message!!!")
	}
}