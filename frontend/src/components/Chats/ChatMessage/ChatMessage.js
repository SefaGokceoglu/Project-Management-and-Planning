import React, { useState } from "react";
import SendIcon from "@material-ui/icons/Send";
import axios from "axios";
function ChatMessage({ SelectedChat, socket, setRecievedMessage }) {
  const [Message, setMessage] = useState("");

  const SendMessageHandler = async (e) => {
    e.preventDefault();
    if (SelectedChat.sendedTo_ID) {
      const response = await axios.post(
        `http://localhost:7000/message/${SelectedChat.sendedTo_ID}`,
        { text: Message }
      );

      if (response && response.data) {
        setRecievedMessage(response.data.newMessage);
        socket.emit("SendMessage", response.data.newMessage);

        setMessage("");
      }
    }
    if (SelectedChat.GroupID) {
      const response = await axios.post(
        `http://localhost:7000/groupmessage/${SelectedChat.GroupID}`,
        { text: Message }
      );

      if (response && response.data) {
        setRecievedMessage(response.data);
        socket.emit("SendGroupMessage", response.data);

        setMessage("");
      }
    }
  };
  return (
    <form
      className="d-flex justify-content-center align-items-center pb-1"
      onSubmit={SendMessageHandler}
    >
      <input
        type="text"
        className="form-control w-75"
        value={Message}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        placeholder=" Enter Message"
      />
      <button type="submit" className="btn" onClick={SendMessageHandler}>
        <SendIcon />
      </button>
    </form>
  );
}

export default ChatMessage;
