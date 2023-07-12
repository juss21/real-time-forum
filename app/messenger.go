package app

import (
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

type returnChatData struct {
	UserName     string
	ReceiverName string
	Messages     []ReturnMessage
}
