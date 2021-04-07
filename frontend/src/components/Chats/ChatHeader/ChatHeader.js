import React from "react";
import PersonIcon from "@material-ui/icons/Person";
import GroupIcon from "@material-ui/icons/Group";
function ChatHeader({ SelectedChat, SelectedGroup }) {
  return (
    <div className="Chat-Header p-3 m-auto shadow">
      <div className="m-auto  shadow">
        <div className=" sendedTo m-auto">
          {SelectedChat ? (
            <div className="d-flex justify-content-start align-items-center ml-5">
              {SelectedChat.ChatID ? (
                <PersonIcon fontSize="large" />
              ) : (
                <GroupIcon fontSize="large" />
              )}
              <h1 className=" ml-4 ">{SelectedChat.name}</h1>
            </div>
          ) : (
            <div>
              <h3 className="text-center">
                Select a group or a Chat to open ChatBOX .
              </h3>
              <p className="text-center">
                İf you dont have any send a message from Users to Create Private
                Chat
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;
