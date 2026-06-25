import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChatMessages = async () => {
    try {
      const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
        withCredentials: true,
      });
      const chatMessages = chat?.data?.messages.map((msg) => {
        const { senderId, text } = msg;
        return {
          firstName: senderId?.firstName,
          lastName: senderId?.lastName,
          text,
        };
      });
      setMessages(chatMessages);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!userId) return;

    const socket = createSocketConnection();
    socketRef.current = socket;
    socket.emit("joinChat", { userId, targetUserId });

    socket.on("messageReceived", ({ firstName, lastName, text }) => {
      setMessages((prev) => [...prev, { firstName, lastName, text }]);
    });

    return () => {
      socket.disconnect(); // fixed typo: was socket.disconnet()
    };
  }, [userId, targetUserId]);

  const sendMessage = () => {
    const trimmed = newMessage.trim();
    if (!trimmed || !socketRef.current) return;

    socketRef.current.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: trimmed,
    });
    setNewMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-6 px-4">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-base-300 rounded-t-xl border-b border-base-200">
        <button
          className="btn btn-ghost btn-sm btn-circle"
          onClick={() => navigate("/connections")}
        >
          ←
        </button>
        <h1 className="font-semibold text-lg">Chat</h1>
      </div>

      {/* Messages */}
      <div className="bg-base-300 h-[60vh] overflow-y-auto p-4 space-y-1">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <span className="loading loading-spinner loading-md text-primary"></span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-50 gap-2">
            <span className="text-4xl">💬</span>
            <p className="text-sm">No messages yet. Say hello!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = user.firstName === msg.firstName;
            return (
              <div
                key={index}
                className={"chat " + (isMe ? "chat-end" : "chat-start")}
              >
                <div className="chat-header text-xs opacity-50 mb-0.5">
                  {isMe ? "You" : `${msg.firstName} ${msg.lastName}`}
                </div>
                <div className={"chat-bubble " + (isMe ? "chat-bubble-primary" : "")}>
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-base-300 rounded-b-xl border-t border-base-200 flex items-center gap-2">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="input flex-1"
          placeholder="Type a message… (Enter to send)"
        />
        <button
          onClick={sendMessage}
          className="btn btn-primary btn-sm px-4"
          disabled={!newMessage.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
