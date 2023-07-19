package app

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	sqlDB "01.kood.tech/git/kasepuu/real-time-forum/database"
)

func GetUserListHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("Userlist, request!")
	userList := getAllUsers(r)
	w.WriteHeader(http.StatusOK)
	err := json.NewEncoder(w).Encode(userList)
	if err != nil {
		log.Println(err)
		return
	}
}

func GetPostListHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("Post send, request!")
	posts := getAllPosts()
	w.WriteHeader(http.StatusOK)
	err := json.NewEncoder(w).Encode(posts)
	if err != nil {
		log.Println(err)
		return
	}

}

func SaveMessageHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("Saving message!")
	var newPostInfo NewPostInfo
	err := json.NewDecoder(r.Body).Decode(&newPostInfo)
	if err != nil {

	} else {
	}
	w.WriteHeader(http.StatusOK)
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

func AddPostHandler(w http.ResponseWriter, r *http.Request) {
	var newPostInfo NewPostInfo
	err := json.NewDecoder(r.Body).Decode(&newPostInfo)
	errorHandler(err)

	fmt.Println(newPostInfo)

	userId := r.URL.Query().Get("UserID")

	var emptyTitle = strings.TrimSpace(newPostInfo.Title) == ""
	var emptyContent = strings.TrimSpace(newPostInfo.Content) == ""

	if emptyTitle || emptyContent {
		log.Println("Error creating a comment! Empty content!")
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(newPostInfo.Title + " " + newPostInfo.Content))
		return
	} else {

		statement, _ := sqlDB.DataBase.Prepare("INSERT INTO posts (userId, title, content, categoryId, date) VALUES (?,?,?,?,?)")

		currentTime := time.Now().Format("02.01.2006 15:04")

		_, erro := statement.Exec(userId, newPostInfo.Title, newPostInfo.Content, 2, currentTime)
		if erro != nil {
			fmt.Println("one per user")
		}

		w.WriteHeader(http.StatusOK)
		w.Write([]byte("TIPTOP!"))
	}
}

func AddCommentHandler(w http.ResponseWriter, r *http.Request) {
	var newCommentInfo NewCommentInfo
	err := json.NewDecoder(r.Body).Decode(&newCommentInfo)
	errorHandler(err)

	fmt.Println(newCommentInfo)

	userId := r.URL.Query().Get("UserID")

	var emptyContent = strings.TrimSpace(newCommentInfo.Content) == ""

	if emptyContent {
		log.Println("Error creating a comment! Empty content!")
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(newCommentInfo.Content + " " + newCommentInfo.PostID))
		return
	} else {
		statement, _ := sqlDB.DataBase.Prepare("INSERT INTO comments (userId, postId, content, datecommented) VALUES (?,?,?,?)")

		currentTime := time.Now().Format("02.01.2006 15:04")

		_, erro := statement.Exec(userId, newCommentInfo.PostID, newCommentInfo.Content, currentTime)
		if erro != nil {
			fmt.Println("one per user")
		}

		w.WriteHeader(http.StatusOK)
		w.Write([]byte("TIPTOP!"))
	}
}
