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
	Message    string `json:"message"`
	SenderID   int    `json:"senderId"`
	ReceiverID int    `json:"receiverId"`
}

type SendActiveUsers struct {
	Amount int `json:"amount"`
}

// event handlers
func (m *wsManager) setupEventHandlers() {
	m.handlers[EventGetOnlineMembers] = GetOnlineMembersHandler
	m.handlers[EventSendMessage] = SendMessageHandler
	m.handlers[EventLoadMessage] = LoadMessagesHandler
}

const EventGetOnlineMembers = "get_online_members"

func GetOnlineMembersHandler(event Event, c *Client) error {
	var userId int
	if err := json.Unmarshal(event.Payload, &userId); err != nil {
		return fmt.Errorf("bad payload in request: %v", err)
	}

	fmt.Printf("EVENT: getting online members, requested by: %v\n", getUserName(userId))

	// sending out a update to all clients

	fmt.Println("INFO: Clients:", len(c.manager.clients), c.manager.clients)

	// sending data back to the clients
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

	return nil
}

const EventSendMessage = "send_message"

func SendMessageHandler(event Event, c *Client) error {
	fmt.Println("EVENT:", "sending message")

	return nil
}

const EventLoadMessage = "load_messages"

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

	fmt.Println("unmarshalled data:", loadMessage)

	responseData := LoadMessages(loadMessage.Sender, loadMessage.Receiver)

	response, err := json.Marshal(responseData)
	if err != nil {
		log.Printf("There was an error marshalling response %v", err)
	}

	// sending data back to the client
	var responseEvent Event
	responseEvent.Type = EventLoadMessage
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
