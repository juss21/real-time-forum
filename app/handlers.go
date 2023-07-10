package app

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
)

func getAllUsers(r *http.Request) (users []UserResponse) {
	uid := r.URL.Query().Get("UserID")

	rows, _ := DataBase.Query("SELECT id, username FROM users WHERE id != ?", uid)
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
	userList := getAllUsers(r)
	w.WriteHeader(http.StatusOK)
	err := json.NewEncoder(w).Encode(userList)
	if err != nil {
		log.Println(err)
		return
	}
}

func getAllPosts() (posts []PostResponse) {
	rows, err := DataBase.Query("SELECT id, userId, title, content, categoryId, date FROM posts")
	if err != nil {
		fmt.Println(err)
		os.Exit(0)
	}
	defer rows.Close()
	for rows.Next() {
		var post PostResponse
		var categoryId int
		rows.Scan(&post.PostID, &post.OriginalPosterID, &post.Title, &post.Content, &categoryId, &post.Date)

		post.OriginalPoster = getUserName(post.OriginalPosterID)
		post.Category = getCategoryFromID(categoryId)
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

func getAllComments(postId int) (postData PostResponse, comments []CommentResponse) {
	rows, err := DataBase.Query("SELECT id, userId, content, datecommented FROM comments WHERE postId = ?", postId)
	if err != nil {
		fmt.Println(err)
		os.Exit(0)
	}
	defer rows.Close()

	for rows.Next() {
		var comment CommentResponse
		rows.Scan(&comment.CommentID, &comment.OriginalPosterID, &comment.Content, &comment.Date)
		comment.PostID = postId
		comment.OriginalPoster = getUserName(comment.OriginalPosterID)
		comments = append(comments, comment)
	}

	row, erro := DataBase.Query("SELECT userId, title, content, categoryId, date FROM posts WHERE id = ?", postId)
	if erro != nil {
		fmt.Println(erro)
		os.Exit(0)
	}

	for row.Next() {
		row.Scan(&postData.OriginalPosterID, &postData.Title, &postData.Content, &postData.Category, &postData.Date)
		postData.OriginalPoster = getUserName(postData.OriginalPosterID)
	}

	return postData, comments
}

func SendCommentList(w http.ResponseWriter, r *http.Request) {
	log.Println("Comment send, request!")
	postId, err := strconv.Atoi(r.URL.Query().Get("PostID"))
	if err == nil {
		postData, comments := getAllComments(postId)

		response := CommentResponseWPostData{
			PostData: postData,
			Comments: comments,
		}

		w.WriteHeader(http.StatusOK)
		err := json.NewEncoder(w).Encode(response)
		if err != nil {
			log.Println(err)
			return
		}
	} else {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Bad attempt!"))
	}
}
