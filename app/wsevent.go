//	https://www.youtube.com/watch?v=pKpKv9MKN-E&ab_channel=ProgrammingPercy
//
// https://youtu.be/pKpKv9MKN-E?t=5559 -> edasi vaadata
package app

import (
	"encoding/json"
	"fmt"
	"log"
)

type Event struct {
	Type    string          `json:"type"`
	Payload json.RawMessage `json:"payload"`
}

type EventHandler func(event Event, c *Client) error

type SendMessageEvent struct {
	Message      string `json:"Message"`
	SenderID     int    `json:"SenderId"`
	ReceiverName string `json:"ReceiverName"`
}

type SendActiveUsers struct {
	Amount int `json:"amount"`
}

// event handlers
func (m *wsManager) setupEventHandlers() {
	m.handlers[EventGetOnlineMembers] = GetOnlineMembersHandler
	m.handlers[EventSendMessage] = SendMessageHandler
	m.handlers[EventLoadMessages] = LoadMessagesHandler
}

const EventGetOnlineMembers = "get_online_members"

func GetOnlineMembersHandler(event Event, c *Client) error {
	var userId int
	if err := json.Unmarshal(event.Payload, &userId); err != nil {
		return fmt.Errorf("bad payload in request: %v", err)
	}

	fmt.Printf("EVENT: getting online members, requested by: %v\n", getUserName(userId))

	// sending out a update to all clients

	for clients := range c.client.clients {
		fmt.Println("Currently active client, with userId:", clients.userId)
	}

	// sending data back to the clients
	for client := range c.client.clients {

		// TODO, ümber teha. Et messageboxis oleks võimalik eristada online/offline
		onlineUserCount := getOnlineUsers()
		data, err := json.Marshal(onlineUserCount)
		if err != nil {
			return fmt.Errorf("failed to marshal broadcast message: %v", err)
		}

		var responseEvent Event
		responseEvent.Type = EventGetOnlineMembers
		responseEvent.Payload = data
		client.egress <- responseEvent
	}

	return nil
}

const EventLoadMessages = "load_messages"

type loadMessages struct {
	Sender   string `json:"userName"`
	Receiver string `json:"receivingUser"`
	Method   string `json:"type"`
}

func LoadMessagesHandler(event Event, c *Client) error {
	fmt.Println("EVENT:", "loading messages", c.userId)
	fmt.Println(event.Payload)

	var loadMessage loadMessages

	if err := json.Unmarshal(event.Payload, &loadMessage); err != nil {
		return fmt.Errorf("bad payload in request: %v", err)
	}

	responseData := LoadMessages(loadMessage.Sender, loadMessage.Receiver)

	response, err := json.Marshal(responseData)
	if err != nil {
		log.Printf("There was an error marshalling response %v", err)
	}

	// sending data back to the client
	var responseEvent Event
	responseEvent.Type = EventLoadMessages
	responseEvent.Payload = response

	c.egress <- responseEvent
	/*
		for client := range c.manager.clients {
			data, err := json.Marshal(len(c.manager.clients))
			if err != nil {
				return fmt.Errorf("failed to marshal broadcast message: %v", err)
			}

			var responseEvent Event
			responseEvent.Type = EventGetOnlineMembers
			responseEvent.Payload = data
			client.egress <- responseEvent
		}
	*/
	return nil
}

const EventSendMessage = "send_message"

func SendMessageHandler(event Event, c *Client) error {
	fmt.Println("EVENT:", "sending message")

	var sendMessage SendMessageEvent

	fmt.Println(string(event.Payload))

	if err := json.Unmarshal(event.Payload, &sendMessage); err != nil {
		return fmt.Errorf("bad payload in request: %v", err)
	}

	receivingUserID := getUserId(sendMessage.ReceiverName)
	SaveChat(c.userId, receivingUserID, "0", sendMessage.Message)

	// updating the chatbox for each individual
	var loadMessage loadMessages
	if err := json.Unmarshal(event.Payload, &loadMessage); err != nil {
		return fmt.Errorf("bad payload in request: %v", err)
	}
	responseData := LoadMessages(loadMessage.Sender, loadMessage.Receiver)

	response, err := json.Marshal(responseData)
	if err != nil {
		log.Printf("There was an error marshalling response %v", err)
	}

	for client := range c.client.clients {
		if client.userId == receivingUserID || client.userId == c.userId {
			// update here
			var responseEvent Event
			responseEvent.Type = EventLoadMessages
			responseEvent.Payload = response

			client.egress <- responseEvent
			// LoadMessagesHandler(event, c) // load all the messages again
		}
	}

	return nil
}
