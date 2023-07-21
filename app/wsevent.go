//	https://www.youtube.com/watch?v=pKpKv9MKN-E&ab_channel=ProgrammingPercy
//
// https://youtu.be/pKpKv9MKN-E?t=5559 -> edasi vaadata
package app

import (
	"encoding/json"
	"fmt"
	"log"
	"strconv"
	"strings"
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
	m.handlers[EventLoadPosts] = GetAllPosts
	m.handlers[EventRefreshPosts] = GetAllPosts
	m.handlers[EventSortUsers] = SortUserList
}

const EventGetOnlineMembers = "get_online_members"

var onlineUsersArray []int

func GetOnlineMembersHandler(event Event, c *Client) error {
	var payload string // stringiks teha!! praegu pushib userid ja -1 (-1 => välja logimine), sellep err
	if err := json.Unmarshal(event.Payload, &payload); err != nil {
		return fmt.Errorf("bad payload in request: %v", err)
	}
	fmt.Println("Getting online members:", payload)

	var login = true

	if !strings.Contains(payload, "log-in") {
		login = false
	}

	userId, err := strconv.Atoi(payload[7:])
	if err != nil {
		fmt.Println("FATAL STRCONV USERID>:", err, login)
	}

	onlineUserList := getOnlineUsers()
	fmt.Println(onlineUserList)
	if !login {
		onlineUserList = removeFromSlice(onlineUserList, userId)
	}
	onlineUsersArray = onlineUserList

	// sending data back to the clients
	for client := range c.client.clients {
		// TODO, ümber teha. Et messageboxis oleks võimalik eristada online/offline
		data, err := json.Marshal(onlineUserList)
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

const EventLoadPosts = "load_posts"
const EventRefreshPosts = "refresh-posts-for-all"

func GetAllPosts(event Event, c *Client) error {
	var userId int
	if err := json.Unmarshal(event.Payload, &userId); err != nil {
		return fmt.Errorf("bad payload in request: %v", err)
	}

	// sending data back to the client
	for client := range c.client.clients {
		posts := getAllPosts()
		data, err := json.Marshal(posts)
		if err != nil {
			return fmt.Errorf("failed to marshal broadcast message: %v", err)
		}

		var responseEvent Event
		responseEvent.Type = EventLoadPosts
		responseEvent.Payload = data

		if event.Type != EventRefreshPosts && client.userId == userId {
			client.egress <- responseEvent
		} else {
			client.egress <- responseEvent
		}

	}

	return nil
}

/*MESSAGE HANDLERS*/

type loadMessages struct {
	Sender   string `json:"userName"`
	Receiver string `json:"receivingUser"`
	Method   string `json:"type"`
	Limit    int    `json:"limit"`
}

const EventSortUsers = "update_users"

func SortUserList(event Event, c *Client) error {
	var loadMessage loadMessages
	forOthers := strings.Contains(string(event.Payload), "other")
	fmt.Println(string(event.Payload), forOthers)

	if err := json.Unmarshal(event.Payload, &loadMessage); err != nil {
		if !forOthers {
			return fmt.Errorf("bad payload in request: %v", err)
		}
	}

	for client := range c.client.clients {
		if forOthers && client.userId == c.userId {
			continue
		}
		//if client.userId == getUserId(loadMessage.Sender) || client.userId == getUserId(loadMessage.Receiver) || string(event.Payload) == "newRegister" {

		responseData := getAllUsers(client.userId)
		response, err := json.Marshal(responseData)
		if err != nil {
			log.Printf("There was an error marshalling response %v", err)
		}

		// sending data back to the client
		var responseEvent Event
		responseEvent.Type = EventSortUsers
		responseEvent.Payload = response

		client.egress <- responseEvent
		//	}
	}

	return nil
}

const EventLoadMessages = "load_all_messages"

func LoadMessagesHandler(event Event, c *Client) error {
	fmt.Println("EVENT:", "loading messages", c.userId)

	var loadMessage loadMessages

	sql := `SELECT userid, receiverid, datesent, message FROM chat WHERE (userid = ? AND receiverid = ?) OR
	(receiverid = ? AND userid = ?) ORDER BY messageid DESC LIMIT ?`

	if err := json.Unmarshal(event.Payload, &loadMessage); err != nil {
		return fmt.Errorf("bad payload in request: %v", err)
	}
	for client := range c.client.clients {
		if client.userId == getUserId(loadMessage.Sender) {

			responseData := LoadMessages(sql, getUserName(client.userId), loadMessage.Receiver, loadMessage.Limit)
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
	(receiverid = ? AND userid = ?) ORDER BY messageid DESC LIMIT ?`

	if err := json.Unmarshal(event.Payload, &loadMessage); err != nil {
		return fmt.Errorf("bad payload in request: %v", err)
	}
	for client := range c.client.clients {
		if client.userId == getUserId(loadMessage.Sender) || client.userId == getUserId(loadMessage.Receiver) {

			receiverName := ""
			if client.userId == getUserId(loadMessage.Sender) {
				receiverName = loadMessage.Receiver
			} else {
				receiverName = loadMessage.Sender
			}

			responseData := LoadMessages(sql, getUserName(client.userId), receiverName, loadMessage.Limit)
			response, err := json.Marshal(responseData)
			if err != nil {
				log.Printf("There was an error marshalling response %v", err)
			}
			log.Println("SÕNUM SIIN:", responseData)
			// sending data back to the client
			var responseEvent Event
			responseEvent.Type = EventOneMessage
			responseEvent.Payload = response

			client.egress <- responseEvent

		}
	}

	return nil
}
