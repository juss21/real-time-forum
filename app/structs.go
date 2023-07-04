package app

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
	Action  string
	Name    string
	Message string
}

type LoginInfo struct {
	Login    string `json:"loginid"`
	Password string `json:"password"`
}
