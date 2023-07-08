package app

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
)

func getAllUsers() (users []UserResponse) {
	rows, _ := DataBase.Query("SELECT id, username FROM users")
	defer rows.Close()
	for rows.Next() {
		var user UserResponse
		rows.Scan(&user.UserID, &user.UserName)
		users = append(users, user)
	}
	return
}

func SendUserList(w http.ResponseWriter, r *http.Request) {
	log.Println("Userlist, request!")
	userList := getAllUsers()
	w.WriteHeader(http.StatusOK)
	err := json.NewEncoder(w).Encode(userList)
	if err != nil {
		log.Println(err)
		return
	}
}

func getAllPosts() (posts []PostResponse) {
	rows, err := DataBase.Query("SELECT id, userId, title, content FROM posts")
	if err != nil {
		fmt.Println("Siin")
		os.Exit(0)
	}
	defer rows.Close()
	for rows.Next() {
		var post PostResponse
		rows.Scan(&post.PostID, &post.OriginalPosterID, &post.Title, &post.Content)
		post.OriginalPoster = getUserName(post.OriginalPosterID)
		posts = append(posts, post)
	}
	return
}

func SendPostList(w http.ResponseWriter, r *http.Request) {
	log.Println("Post send, request!")
	posts := getAllPosts()
	w.WriteHeader(http.StatusOK)
	err := json.NewEncoder(w).Encode(posts)
	if err != nil {
		log.Println(err)
		return
	}
}
