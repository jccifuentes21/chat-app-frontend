import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Logout from "./Logout";
import ChatInput from "./ChatInput";
import axios from "axios";
import { sendMessageRoute, getMessagesRoute } from "../utils/APIRoutes";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ChatContainer({ currentChat, currentUser, socket }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const handleEmojiPickerHideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const hideEmojiPicker = () => {
    setShowEmojiPicker(false);
  };

  useEffect(() => {
    const fetchMessages = async () => {
      if (currentChat && currentUser) {
        const response = await axios.post(getMessagesRoute, {
          from: currentUser._id,
          to: currentChat._id,
        });
        setMessages(response.data);
      }
    };

    fetchMessages();

    if (socket.current) {
      socket.current.on("receive-message", (data) => {
        if (data.to === currentUser._id && data.from === currentChat._id) {
          setMessages((prev) => [
            ...prev,
            { fromSelf: false, message: data.message },
          ]);
        } else {
          toast.info(`New message from ${data.fromUsername}`, toastOptions);
        }
      });
    }

    return () => {
      if (socket.current) {
        socket.current.off("receive-message");
      }
    };
  }, [currentChat]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMsg = async (msg) => {
    await axios.post(sendMessageRoute, {
      from: currentUser._id,
      to: currentChat._id,
      message: msg,
    });

    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: currentUser._id,
      fromUsername: currentUser.username,
      message: msg,
    });

    setMessages((prev) => [...prev, { fromSelf: true, message: msg }]);
  };

  return (
    <>
      {currentChat && (
        <Container>
          <div className="chat-header">
            <div className="user-details">
              <div className="avatar">
                <img src={`${currentChat.avatarImage}`} alt="avatar" />
              </div>
              <div className="username">
                <h4>{currentChat.username}</h4>
              </div>
            </div>
            <Logout />
          </div>
          <div onClick={hideEmojiPicker} className="chat-messages">
            {messages.map((message) => {
              return (
                <div
                  ref={scrollRef}
                  className={`message ${
                    message.fromSelf ? "sent" : "received"
                  }`}
                  key={uuidv4()}
                >
                  <div className="content">
                    <p>{message.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <ChatInput
            handleSendMsg={handleSendMsg}
            showEmojiPicker={showEmojiPicker}
            handleEmojiPickerHideShow={handleEmojiPickerHideShow}
            hideEmojiPicker={hideEmojiPicker}
          />
        </Container>
      )}
      <ToastContainer />
    </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-auto-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    height: 5rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h4 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: var(--secondary-color);
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: var(--primary-text-color);
      }
    }
  }
  .sent {
    justify-content: flex-end;
    .content {
      background-color: var(--chat-bubble-sent);
    }
  }
  .received {
    justify-content: flex-start;
    .content {
      background-color: var(--chat-bubble-received);
    }
  }
`;
