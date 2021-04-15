import React, { useState, useEffect } from "react";
import SimpleBar from "simplebar-react";
import Popup from "reactjs-popup";
import axios from "axios";
import GroupIcon from "@material-ui/icons/Group";
import SendIcon from "@material-ui/icons/Send";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import PersonIcon from "@material-ui/icons/Person";
import ChatIcon from "@material-ui/icons/Chat";
import { Link } from "react-router-dom";
function Sidepanel({
  Groups,
  User,
  Chats,
  People,
  setSelectedGroup,
  setSelectedChat,
  NewChat,
  setNewChat,
}) {
  const [SayHi, setSayHi] = useState("");
  const [AccountLink, setAccountLink] = useState("-");
  let link = "";
  const SendMessageHandler = async (sendedToID) => {
    const response = await axios.post(
      "http://localhost:7000/message/" + sendedToID,
      { text: SayHi }
    );

    if (response && response.data) {
      setSayHi("");
      setNewChat(response.data);
    }
  };
  useEffect(() => {
    async function GetUserLink() {
      const response = await axios.get(
        "http://localhost:7000/users/account/link"
      );

      if (response && response.data) {
        console.log(response.data);
        setAccountLink(response.data);
      }
    }
    GetUserLink();
  }, []);
  return (
    <div className="Groups">
      <div className="d-flex align-items-center justify-content-between p-3 border-bottom border-dark ">
        <div className="d-flex align-items-center justify-content-start">
          <FiberManualRecordIcon
            style={{ color: "#17fc03" }}
            className="ml-3 mr-2"
          />
          <h3 className="m-0">{User}</h3>
        </div>
        {AccountLink !== "" ? (
          <Link to={AccountLink} className="mr-3">
            <AccountCircleIcon fontSize="large" />
          </Link>
        ) : null}
      </div>
      <div className="accordion" id="accordionGroups">
        <div className="card bg-secondary">
          <div className="card-header" id="headingOne">
            <h2 className=" text-center">
              <button
                className="Orange btn btn-lg"
                type="button"
                data-toggle="collapse"
                data-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                Groups
              </button>
            </h2>
          </div>

          <div
            id="collapseOne"
            className="collapse"
            aria-labelledby="headingOne"
            data-parent="#accordionGroups"
          >
            <div className="d-flex justify-content-center mb-3 mt-3">
              <input
                type="text"
                className="form-control w-75"
                placeholder="Search Group"
              />
            </div>
            <SimpleBar className="Collapsible-SimpleBar" scrollbarMaxSize={45}>
              {Groups.map((group) => {
                return (
                  <div key={group._id} className="Group">
                    <div
                      className="pl-5 d-flex justify-content-start align-items-center shadow"
                      key={group._id}
                      onClick={() => {
                        setSelectedChat({
                          name: group.name,
                          GroupID: group._id,
                        });
                      }}
                    >
                      <GroupIcon className="Group-Icon" />
                      <p>{group.name}</p>
                    </div>
                  </div>
                );
              })}
            </SimpleBar>
          </div>
        </div>
      </div>
      <div className="accordion" id="accordionChats">
        <div className="card bg-secondary">
          <div className="card-header" id="headingTwo">
            <h2 className=" text-center">
              <button
                className="Orange btn btn-lg"
                type="button"
                data-toggle="collapse"
                data-target="#collapseTwo"
                aria-expanded="true"
                aria-controls="collapseTwo"
              >
                Chats
              </button>
            </h2>
          </div>

          <div
            id="collapseTwo"
            className="collapse"
            aria-labelledby="headingTwo"
            data-parent="#accordionChats"
          >
            <div className="d-flex justify-content-center mb-3 mt-3">
              <input
                type="text"
                className="form-control w-75"
                placeholder="Search Chat"
              />
            </div>
            <SimpleBar className="Collapsible-SimpleBar" scrollbarMaxSize={45}>
              {Chats.map((chat) => {
                return (
                  <div
                    key={chat._id}
                    className="Chat-Select shadow mb-1"
                    onClick={() => {
                      setSelectedChat({
                        name: chat.sendedTo.name + " " + chat.sendedTo.lastname,
                        sendedTo_ID: chat.sendedTo._id,
                        ChatID: chat.chat._id,
                      });
                    }}
                  >
                    <div>
                      <div className="pl-5 mb-2 d-flex justify-content-start align-items-center ">
                        <ChatIcon className="Chat-Icon mr-3" />
                        <h3 className="mr-2">{chat.sendedTo.name}</h3>
                        <h3>{chat.sendedTo.lastname}</h3>
                      </div>
                      <p className="pl-5 shadow">
                        Last Message : {chat.chat.lastmessage}
                      </p>
                    </div>
                  </div>
                );
              })}
            </SimpleBar>
          </div>
        </div>
      </div>
      <div className="accordion" id="accordionUsers">
        <div className="card bg-secondary">
          <div className="card-header" id="headingOne">
            <h2 className=" text-center">
              <button
                className="Orange btn btn-lg"
                type="button"
                data-toggle="collapse"
                data-target="#collapseThree"
                aria-expanded="true"
                aria-controls="collapseThree"
              >
                Users
              </button>
            </h2>
          </div>

          <div
            id="collapseThree"
            className="collapse"
            aria-labelledby="headingThree"
            data-parent="#accordionUsers"
          >
            <div className="d-flex justify-content-center mb-3 mt-3">
              <input
                type="text"
                className="form-control w-75"
                placeholder="Search User"
              />
            </div>
            <SimpleBar className="Collapsible-SimpleBar" scrollbarMaxSize={45}>
              {People.map((person) => {
                return (
                  <div key={person._id} className="shadow mb-1">
                    <div>
                      <div
                        className="pl-2 mt-2 d-flex justify-content-start align-items-center "
                        key={person._id}
                      >
                        <PersonIcon className="mr-3" />
                        <h4 className="mr-2">{person.name}</h4>
                        <h4>{person.lastname}</h4>
                        <Popup
                          trigger={
                            <button className="btn Message-Select ml-auto ">
                              <ChatIcon className="Chat-Icon " />
                            </button>
                          }
                        >
                          <form className="bg-dark rounded p-3 d-flex align-items-center justify-content-center">
                            <input
                              onSubmit={(e) => {
                                e.preventDefault();
                                SendMessageHandler(person._id);
                              }}
                              className="form-control"
                              type="text"
                              placeholder={
                                "Say Hi to " +
                                person.name +
                                " " +
                                person.lastname
                              }
                              value={SayHi}
                              onChange={(e) => {
                                setSayHi(e.target.value);
                              }}
                            />
                            <button
                              className="btn Orange"
                              type="submit"
                              onClick={(e) => {
                                e.preventDefault();
                                SendMessageHandler(person._id);
                              }}
                            >
                              <SendIcon />
                            </button>
                          </form>
                        </Popup>
                      </div>
                    </div>
                  </div>
                );
              })}
            </SimpleBar>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidepanel;
