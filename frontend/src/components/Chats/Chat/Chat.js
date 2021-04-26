import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import ChatMessage from "../ChatMessage/ChatMessage";

function Chat({ socket, User, SelectedChat, ChatMessages, setChatMessages }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  //const [ChatMessages, setChatMessages] = useState([]);
  const [RecievedMessage, setRecievedMessage] = useState("");
  const [CurrentUser, setCurrentUser] = useState("");
  const [dataRecieved, setdataRecieved] = useState(false);

  async function GetChatMessages() {
    const response = await axios.get(
      "http://localhost:7000/message/" + SelectedChat.ChatID
    );

    if (response && response.data) {
      setChatMessages(response.data);
      setdataRecieved(true);
    }
  }
  async function GetGroupMessages() {
    const response = await axios.get(
      "http://localhost:7000/groupmessage/" + SelectedChat.GroupID
    );

    if (response && response.data) {
      setChatMessages(response.data.GroupMessages);
      setCurrentUser(response.data.currentUser);
      setdataRecieved(true);
    }
  }
  useEffect(() => {
    if (SelectedChat.ChatID) {
      GetChatMessages();
    } else if (SelectedChat.GroupID) {
      GetGroupMessages();
    }
  }, [SelectedChat]);

  useEffect(() => {
    if (dataRecieved) {
      const chatRoom = SelectedChat.ChatID
        ? SelectedChat.ChatID
        : SelectedChat.GroupID;
      socket.emit(
        "join",
        {
          User,
          ChatRoom: chatRoom,
        },
        () => {}
      );

      socket.on("NewMessage", (message) => {
        setRecievedMessage(message);
      });

      return () => {
        socket.on("disconnect");
        socket.off();
      };
    }
  }, [dataRecieved, SelectedChat, User, socket]);

  useEffect(() => {
    if (RecievedMessage && dataRecieved) {
      setChatMessages([...ChatMessages, RecievedMessage]);
    }
  }, [RecievedMessage, dataRecieved]);

  useEffect(() => {
    scrollToBottom();
  }, [ChatMessages]);

  return (
    <div className="bg-seconady rounded">
      <div className="shadow rounded bg-white m-5 px-3 pt-1">
        <div className="Chat-Messages-Container m-5 px-3 pt-1">
          {ChatMessages.map((message) => {
            if (SelectedChat.ChatID) {
              if (message.sendedTo === SelectedChat.sendedTo_ID) {
                return (
                  <div
                    key={message._id}
                    className="d-flex justify-content-end mb-5"
                  >
                    <div className=" Message-Sended rounded shadow p-1 w-50">
                      <h6 className="ml-2 mt-1">{User}</h6>
                      <div className="d-flex align-items-center justify-content-between">
                        <p className="ml-2">{message.text}</p>
                        {message.createdAt ? (
                          <p className="mr-2">
                            {message.createdAt.slice(11, 16)}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              } else {
                let style;
                if (message.User) {
                  style = "bg-primary";
                } else {
                  style = "Message-Recieved";
                }
                return (
                  <div
                    key={message._id}
                    className="d-flex justify-content-start mb-5"
                  >
                    <div className={style + " rounded shadow p-1 w-50"}>
                      <h6 className="ml-2 mt-1">
                        {message.User ? message.User : SelectedChat.name}
                      </h6>
                      <div className="d-flex align-items-center justify-content-between">
                        <p className="ml-2">{message.text}</p>
                        {message.createdAt ? (
                          <p className="mr-2">
                            {message.createdAt.slice(11, 16)}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              }
            }
            if (SelectedChat.GroupID) {
              if (message.sendedBy.UserID === CurrentUser) {
                return (
                  <div
                    key={message._id}
                    className="d-flex justify-content-end mb-5"
                  >
                    <div className=" Message-Sended rounded shadow p-1 w-50">
                      <h6 className="ml-2 mt-1">
                        {message.sendedBy.name +
                          " " +
                          message.sendedBy.lastname}
                      </h6>
                      <div className="d-flex align-items-center justify-content-between">
                        <p className="ml-2">{message.text}</p>
                        {message.createdAt ? (
                          <p className="mr-2">
                            {message.createdAt.slice(11, 16)}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              } else {
                let style;
                if (message.User) {
                  style = "bg-primary";
                } else {
                  style = "Message-Recieved";
                }
                return (
                  <div
                    key={message._id}
                    className="d-flex justify-content-start mb-5"
                  >
                    <div className={style + " rounded shadow p-1 w-50"}>
                      <h6 className="ml-2 mt-1">
                        {message.sendedBy.name +
                          " " +
                          message.sendedBy.lastname}
                      </h6>
                      <div className="d-flex align-items-center justify-content-between">
                        <p className="ml-2">{message.text}</p>
                        {message.createdAt ? (
                          <p className="mr-2">
                            {message.createdAt.slice(11, 16)}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              }
            }
            return null;
          })}
          <div ref={messagesEndRef} />
        </div>
        {SelectedChat ? (
          <ChatMessage
            SelectedChat={SelectedChat}
            socket={socket}
            setRecievedMessage={setRecievedMessage}
          />
        ) : null}
      </div>
    </div>
  );
}

export default Chat;
