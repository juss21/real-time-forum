package app

import (
	//"encoding/json"
	//"log"
)

type ReceivedMessageType struct {
	ReceivedMessage string `json:"type"`
} 

type ReturnMessageEvent struct {
	MessageId int `json:"messageid"`

	DateSent string `json:"datesent"`
}

type ChatMessage struct {
	UserName      string `json:"userName"`
	ReceivingUser string `json:"receivingUser"`
	MessageDate   string `json:"messageDate"`
	Message       string `json:"message"`
}

