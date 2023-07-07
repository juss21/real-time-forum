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

var DataBase *sql.DB
