package app

import (
	"fmt"
	"net/http"
	"os"

	sqlDB "01.kood.tech/git/kasepuu/real-time-forum/database"
)

func getUserId(loginInput string) (userId int) {
	sqlDB.DataBase.QueryRow("SELECT id FROM users WHERE username = ? OR email = ?", loginInput, loginInput).Scan(&userId)
	return userId
}
func getUserName(userId int) (UserName string) {
	sqlDB.DataBase.QueryRow("SELECT username FROM users WHERE id = ?", userId).Scan(&UserName)
	return UserName
}
func getCategoryFromID(id int) (category string) {
	sqlDB.DataBase.QueryRow("SELECT name FROM category WHERE id = ?", id).Scan(&category)
	return category
}

func getUserIdFomMessage(User string) (userID int) {
	sqlDB.DataBase.QueryRow("SELECT id FROM users WHERE username = ?", User).Scan(&userID)
	return
}

func getUserNameByID(UserID int) (UserName string) {
	sqlDB.DataBase.QueryRow("SELECT username FROM users WHERE id = ?", UserID).Scan(&UserName)
	return
}

func getAllUsers(r *http.Request) (users []UserResponse) {
	uid := r.URL.Query().Get("UserID")

	rows, _ := sqlDB.DataBase.Query("SELECT id, username FROM users WHERE id != ?", uid)
	defer rows.Close()
	for rows.Next() {
		var user UserResponse
		rows.Scan(&user.UserID, &user.UserName)
		users = append(users, user)
	}
	return
}

func getOnlineUsers() int {
	onlineUsers := 0
	rows, _ := sqlDB.DataBase.Query("SELECT COUNT(*) FROM session")
	defer rows.Close()

	if rows.Next() {
		rows.Scan(&onlineUsers)
	}

	return onlineUsers
}

func getAllPosts() (posts []PostResponse) {
	rows, err := sqlDB.DataBase.Query("SELECT id, userId, title, content, categoryId, date FROM posts")
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

func getAllComments(postId int) (postData PostResponse, comments []CommentResponse) {
	rows, err := sqlDB.DataBase.Query("SELECT id, userId, content, datecommented FROM comments WHERE postId = ?", postId)
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

	row, erro := sqlDB.DataBase.Query("SELECT userId, title, content, categoryId, date FROM posts WHERE id = ?", postId)
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

func removeSessionById(id int) {
	_, err := sqlDB.DataBase.Exec("DELETE FROM session WHERE userId = ?", id)
	errorHandler(err)
}
