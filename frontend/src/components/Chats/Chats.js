import React, { useState, useEffect } from "react";
import "./Chats.css";
import axios from "axios";
import Chat from "./Chat/Chat";
import ChatHeader from "./ChatHeader/ChatHeader";
import io from "socket.io-client";
import Sidepanel from "./Sidepanel/Sidepanel";
function Chats({ User, UserProfileURL }) {
  const [socket, setSocket] = useState(null);
  const [Groups, setGroups] = useState([]);
  const [Chats, setChats] = useState([]);
  const [People, setPeople] = useState([]);

  const [SelectedChat, setSelectedChat] = useState("");
  const [NewChat, setNewChat] = useState("");
  const [ChatMessages, setChatMessages] = useState([]);
  useEffect(() => {
    async function GetGroups() {
      const response = await axios.get("http://localhost:7000/groups");

      if (response && response.data) {
        setGroups([
          ...response.data.CreatedGroups,
          ...response.data.UserGroups,
        ]);
      }
    }
    GetGroups();
  }, []);
  useEffect(() => {
    async function GetChats() {
      const response = await axios.get("http://localhost:7000/groups/chats");

      if (response && response.data) {
        setChats(response.data);
      }
    }
    GetChats();
  }, [NewChat]);

  useEffect(() => {
    async function GetUsers() {
      const response = await axios.get("http://localhost:7000/users/");

      if (response && response.data) {
        setPeople(response.data);
      }
    }
    GetUsers();
  }, []);

  useEffect(() => {
    setSocket(io("localhost:7000"));
  }, [User]);
  return (
    <div className="bg-secondary">
      <div className="Chat-Container">
        <div className="Sidepanel">
          <Sidepanel
            Groups={Groups}
            User={User}
            Chats={Chats}
            setChats={setChats}
            People={People}
            setSelectedChat={setSelectedChat}
            NewChat={NewChat}
            setNewChat={setNewChat}
            UserProfileURL={UserProfileURL}
            setChatMessages={setChatMessages}
          />
        </div>
        <div className="Chat">
          <ChatHeader SelectedChat={SelectedChat} />
          <Chat
            SelectedChat={SelectedChat}
            User={User}
            socket={socket}
            ChatMessages={ChatMessages}
            setChatMessages={setChatMessages}
          />
        </div>
      </div>
    </div>
  );
}

export default Chats;
