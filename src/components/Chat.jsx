import React, { useState, useEffect } from "react";

const sanitizeText = (text) => {
  const element = document.createElement("div");
  element.innerText = text;
  return element.innerHTML;
};

const Chat = ({ token }) => {
  const [messages, setMessages] = useState(
    JSON.parse(localStorage.getItem("messages")) || []
  );
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState("");
  const [activeConversation, setActiveConversation] = useState(
    localStorage.getItem("conversationId") || ""
  );
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const [userId] = useState(localStorage.getItem("userId") || "");
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState(
    JSON.parse(localStorage.getItem("conversations")) || []
  );
  
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch(
        "https://chatify-api.up.railway.app/messages",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: sanitizeText(newMessage),
            conversationId: activeConversation,
          }),
        }
      );

      if (!response.ok) throw new Error("Meddelandet kunde inte skickas");

      const { latestMessage } = await response.json();
      setMessages((prevMessages) => {
        const updatedMessages = [
          ...prevMessages,
          { ...latestMessage, userId, username },
        ];
        localStorage.setItem("messages", JSON.stringify(updatedMessages));
        return updatedMessages;
      });

      setNewMessage("");
    } catch (error) {
      setError("Meddelandet kunde inte skickas");
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const response = await fetch(
        `https://chatify-api.up.railway.app/messages/${messageId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Meddelandet kunde inte raderas");

      setMessages((prevMessages) => {
        const updatedMessages = prevMessages.filter(
          (message) => message.id !== messageId
        );
        localStorage.setItem("messages", JSON.stringify(updatedMessages));
        return updatedMessages;
      });
    } catch (error) {
      setError("Meddelandet kunde inte raderas");
    }
  };

  const handleSelectConversation = (conversation) => {
    setActiveConversation(conversation.id);
    localStorage.setItem("conversationId", conversation.id);
  };

  useEffect(() => {
    if (!activeConversation) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `https://chatify-api.up.railway.app/messages?conversationId=${activeConversation}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Kunde inte hämta meddelanden");

        const messagesData = await response.json();
        setMessages(messagesData);
        localStorage.setItem("messages", JSON.stringify(messagesData));

        const conversationExists = conversations.some(
          (convo) => convo.id === activeConversation
        );
        if (!conversationExists) {
          const newConversation = {
            id: activeConversation,
            name: "Ny konversation",
          };
          const updatedConversations = [...conversations, newConversation];
          setConversations(updatedConversations);
          localStorage.setItem(
            "conversations",
            JSON.stringify(updatedConversations)
          );
        }
      } catch (error) {
        setError("Kunde inte hämta meddelanden");
      }
    };

    fetchMessages();
  }, [activeConversation, token, conversations]);
  const [fakeChat, setFakeChat] = useState([
    {
      text: "Hej, välkommen till chatten skapad av Idiris",
      avatar: "https://i.pravatar.cc/100",
      username: "IdirisAI!",
      userId: "fakeId1",
      conversationId: null,
    },
    {
      text: "Kan jag hjälpa dig med något. Helst inte snälla!",
      avatar: "https://i.pravatar.cc/100",
      username: "IdirisAI",
      userId: "fakeId1",
      conversationId: null,
    },
    {
      text: "Fan vad nice! Jo jag ska flytta på fredag och behöver någon som kan hjälpa mig bära alla tunga lådor:)",
      avatar: "https://i.pravatar.cc/101",
      username: username,
      userId: userId,
      conversationId: null,
    },
  ]);

  return (
    <div
      className="bg-cover bg-center min-h-screen flex flex-col items-center justify-center"
      style={{
        backgroundImage: "url('/src/components/Assets/ChatBackground.svg')",
      }}
    >
      <div className="flex w-full max-w-4xl">
        <div className="fixed right-2 top-1 bottom-2 min-w-[15rem] bg-white bg-opacity-60 backdrop-blur-lg rounded-lg shadow-lg p-5 overflow-auto">
          <ul className="max-h-[75vh] overflow-y-scroll list-none p-0 m-0">
            {users.map((user) => (
              <li key={user.userId} className="flex items-center mb-2">
                <span className="mr-2 text-gray-800">{user.username}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1 flex flex-col ml-[15rem] p-4">
          
          <div className="flex-1 overflow-auto bg-white bg-opacity-60 backdrop-blur-lg rounded-lg shadow-lg p-4">
            <div className="message-container">
              {fakeChat.map((message, index) => (
                <div
                  key={index}
                  className={`message-item ${
                    message.userId === userId ? "user" : "other"
                  }`}
                >
                  <div
                    className={`flex items-start ${
                      message.userId === userId ? "flex-row-reverse" : ""
                    } space-x-2`}
                  >
                    <img
                      src={message.avatar}
                      alt="avatar"
                      className="message-avatar w-8 h-8 rounded-full"
                    />
                    <div
                      className={`message-bubble ${
                        message.userId === userId ? "user" : "other"
                      }`}
                    >
                      <div className="text-sm font-semibold">
                        {message.username}
                      </div>
                      <p
                        className="text-sm"
                        dangerouslySetInnerHTML={{
                          __html: sanitizeText(message.text),
                        }}
                      ></p>
                    </div>
                  </div>
                </div>
              ))}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`message-item ${
                    message.userId === userId ? "user" : "other"
                  }`}
                >
                  <div
                    className={`flex items-start ${
                      message.userId === userId ? "flex-row-reverse" : ""
                    } space-x-2`}
                  >
                    <img
                      src={message.avatar || "https://i.pravatar.cc/100"}
                      alt="avatar"
                      className="message-avatar w-8 h-8 rounded-full"
                    />
                    <div
                      className={`message-bubble ${
                        message.userId === userId ? "user" : "other"
                      }`}
                    >
                      <div className="text-sm font-semibold">
                        {message.username}
                      </div>
                      <p
                        className="text-sm"
                        dangerouslySetInnerHTML={{
                          __html: sanitizeText(message.text),
                        }}
                      ></p>
                      {message.userId === userId && (
                        <button
                          onClick={() => handleDeleteMessage(message.id)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          Radera
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center mt-4">
            <input
              id="newMessageInput"
              name="newMessage"
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Skriv ett meddelande..."
              className="flex-1 p-3 border border-gray-300 rounded-full bg-gray-800 text-white placeholder-gray-400"
            />
            <button
              onClick={handleSendMessage}
              className="ml-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600"
            >
              Skicka
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
