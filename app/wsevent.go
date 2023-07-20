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
	m.handlers[EventOneMessage] = LoadOneMessageHandler
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

const EventLoadMessages = "load_all_messages"

type loadMessages struct {
	Sender   string `json:"userName"`
	Receiver string `json:"receivingUser"`
	Method   string `json:"type"`
}

func LoadMessagesHandler(event Event, c *Client) error {
	fmt.Println("EVENT:", "loading messages", c.userId)

	var loadMessage loadMessages

	sql := `SELECT userid, receiverid, datesent, message FROM chat WHERE (userid = ? AND receiverid = ?) OR
	(receiverid = ? AND userid = ?) ORDER BY messageid`

	if err := json.Unmarshal(event.Payload, &loadMessage); err != nil {
		return fmt.Errorf("bad payload in request: %v", err)
	}
	for client := range c.client.clients {
		if client.userId == getUserId(loadMessage.Sender) {

			responseData := LoadMessages(sql, getUserName(client.userId), loadMessage.Receiver)
			response, err := json.Marshal(responseData)
			if err != nil {
				log.Printf("There was an error marshalling response %v", err)
			}

			// sending data back to the client
			var responseEvent Event
			responseEvent.Type = EventLoadMessages
			responseEvent.Payload = response

			client.egress <- responseEvent

		}
	}
	return nil
}

const EventSendMessage = "send_message2"

func SendMessageHandler(event Event, c *Client) error {
	fmt.Println("EVENT:", "sending message")

	var sendMessage SendMessageEvent

	if err := json.Unmarshal(event.Payload, &sendMessage); err != nil {
		return fmt.Errorf("bad payload in request: %v", err)
	}

	receivingUserID := getUserId(sendMessage.ReceiverName)
	SaveChat(c.userId, receivingUserID, sendMessage.Message)

	return nil
}

const EventOneMessage = "load_message"

func LoadOneMessageHandler(event Event, c *Client) error {

	var loadMessage loadMessages

	sql := `SELECT userid, receiverid, datesent, message FROM chat WHERE (userid = ? AND receiverid = ?) OR
	(receiverid = ? AND userid = ?) ORDER BY messageid DESC LIMIT 1`

	if err := json.Unmarshal(event.Payload, &loadMessage); err != nil {
		return fmt.Errorf("bad payload in request: %v", err)
	}
	for client := range c.client.clients {
		if client.userId == getUserId(loadMessage.Sender) {

			responseData := LoadMessages(sql, getUserName(client.userId), loadMessage.Receiver)
			response, err := json.Marshal(responseData)
			if err != nil {
				log.Printf("There was an error marshalling response %v", err)
			}

			// sending data back to the client
			var responseEvent Event
			responseEvent.Type = EventLoadMessages
			responseEvent.Payload = response

			client.egress <- responseEvent

		} else if client.userId == getUserId(loadMessage.Receiver) { //SEE OSA TEKITAB ERRORI KUI TEISEL KASUTAJAL POLE CHAT LAHTI VÕI SIIS LAEB KIRJA VALESSE CHATI

			responseData := LoadMessages(sql, getUserName(client.userId), loadMessage.Sender)

			response, err := json.Marshal(responseData)
			if err != nil {
				log.Printf("There was an error marshalling response %v", err)
			}

			// sending data back to the client
			var responseEvent Event
			responseEvent.Type = EventLoadMessages
			responseEvent.Payload = response

			client.egress <- responseEvent
		}
	}

	return nil
}
