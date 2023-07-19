package app

import (
	"fmt"
	"log"
	"time"

	sqlDB "01.kood.tech/git/kasepuu/real-time-forum/database"
	// "encoding/json"
	// "log"
)

type ReceivedMessageType struct {
	ReceivedMessage string `json:"type"`
}

type ReturnMessage struct {
	UserName      string
	ReceivingUser string
	MessageDate   string
	Message       string
}

type ChatMessage struct {
	UserName      string `json:"userName"`
	ReceivingUser string `json:"receivingUser"`
	MessageDate   string `json:"messageDate"`
	Message       string `json:"message"`
}

type LoadRequest struct {
	UserName      string `json:"userName"`
	ReceivingUser string `json:"receivingUser"`
}

type ReturnChatData struct {
	UserName     string
	ReceiverName string
	Messages     []ReturnMessage
}

func LoadMessages(userName string, receiverName string) ReturnChatData {
	var chat ReturnChatData

	chat.UserName = userName
	chat.ReceiverName = receiverName

	userID := getUserIdFomMessage(userName)
	receiverID := getUserIdFomMessage(receiverName)

	rows, err := sqlDB.DataBase.Query(`SELECT userid, receiverid, datesent, message FROM chat WHERE (userid = ? AND receiverid = ?) OR
	(receiverid = ? AND userid = ?) ORDER BY datesent DESC`, userID, receiverID, userID, receiverID)
	if err != nil {
		log.Println(err)
	}
	defer rows.Close()
	var sender, receiver int
	for rows.Next() {
		var messageData ReturnMessage

		rows.Scan(&sender, &receiver, &messageData.MessageDate, &messageData.Message)
		log.Println(sender, "senderISHEREEEEE")
		messageData.UserName = getUserNameByID(sender)
		messageData.ReceivingUser = getUserNameByID(receiver)
		log.Println(messageData, "SIIIIIIN", sender, receiver, "PEKKIS")

		chat.Messages = append(chat.Messages, messageData)
	}
	return chat
}

func SaveChat(userID int, receiverID int, Message string) {

	DateSent := time.Now().Format("02.01.2006 15:04")

	statement, _ := sqlDB.DataBase.Prepare("INSERT INTO chat (userid, receiverid, datesent, message) VALUES (?,?,?,?)")
	_, err2 := statement.Exec(userID, receiverID, DateSent, Message)
	if err2 != nil {
		fmt.Println("Error saving message!!!")
	}
}
