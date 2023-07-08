package app

import "database/sql"

// information that will be pushed in to the site
type CurrentUser struct {
	UserID     int
	UserName   string
	Reputation int
	Rank       string
}

type Forum struct {
	Loggedin    bool
	LoggedUser  CurrentUser
	ErrorMsg    string
	ErrorsFound bool
}

var PageData Forum

type loginMessage struct {
	LoginName string
	UserID    int
	CookieKey string
}

type cookieResponse struct {
	UserID    int
	CookieKey string
}

type sessionInfo struct {
	Name    string `json:"session-id"`
	Value   string
	Expires string
}

type LoginInfo struct {
	Login    string `json:"login_id"`
	Password string `json:"login_pw"`
}

type RegisterInfo struct {
	Username  string `json:"register_nickname"`
	Age       string `json:"register_age"`
	Gender    string `json:"register_gender"`
	FirstName string `json:"register_fname"`
	LastName  string `json:"register_lname"`
	Email     string `json:"register_mail"`
	Password  string `json:"register_passwd"`
}

var DataBase *sql.DB
