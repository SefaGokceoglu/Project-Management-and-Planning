import React, { useState } from "react";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import axios from "axios";
import GroupIcon from "@material-ui/icons/Group";
import DeleteIcon from "@material-ui/icons/Delete";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import CreateIcon from "@material-ui/icons/Create";
import Popup from "reactjs-popup";
function MyGroups({
  Mygroups,
  setMygroups,
  Allgroups,
  setAllgroups,
  Loading,
  AdminGroups,
  setAdminGroups,
}) {
  const [showMyGroups, setshowMyGroups] = useState(true);
  const [InviteKey, setInviteKey] = useState("");

  const [GroupName, setGroupName] = useState("");
  const [Private, setPrivate] = useState(false);

  async function Unsubscribe(Key) {
    if (Key !== "") {
      const response = await axios.post(
        `http://localhost:7000/groups/unsubscribe/${Key}`
      );

      if (response && response.data) {
        const filterGroups = Mygroups.filter(
          (group) => group._id !== response.data._id
        );

        setMygroups([...filterGroups]);
        setAllgroups([...Allgroups, response.data]);
      }
    }
  }

  async function Delete(DeleteKey) {
    if (DeleteKey !== "") {
      const response = await axios.delete(
        `http://localhost:7000/groups/${DeleteKey}`
      );

      if (response && response.data) {
        const filterGroups = AdminGroups.filter(
          (group) => group._id !== response.data._id
        );

        setAdminGroups([...filterGroups]);
      }
    }
  }
  /*useEffect(() => {
    Delete();
  }, [DeleteKey]);
  */
  const CreateGroupHandler = async (e) => {
    e.preventDefault();

    const group = { name: GroupName, private: Private };

    const response = await axios.post(
      "http://localhost:7000/groups/create",
      group
    );

    if (response && response.data) {
      setAdminGroups([...AdminGroups, response.data]);
    }
  };
  return (
    <div className="MyGroups px-4 pt-5 shadow rounded">
      <div className="d-flex justify-content-around align-items-center bg-secondary shadow rounded">
        <button
          className="groups-btn btn btn-secondary"
          style={{ color: "rgb(255, 119, 51)" }}
          onClick={() => {
            setshowMyGroups(true);
          }}
        >
          Subscribed Groups
        </button>
        <button
          className="groups-btn  btn btn-secondary "
          style={{ color: "rgb(255, 119, 51)" }}
          onClick={() => {
            setshowMyGroups(false);
          }}
        >
          Created Groups
        </button>
      </div>
      <hr />
      <div className="d-flex justify-content-around align-items-center p-0 m-0">
        <h4 className="text-center">
          {showMyGroups ? "Subscribed Groups" : "Created Groups"}
        </h4>
        <Popup
          modal
          trigger={
            <button
              className="btn btn-secondary d-flex justify-content-around align-items-center"
              style={{ color: "rgb(255, 119, 51)" }}
            >
              <CreateIcon />
              <p>Create Group</p>
            </button>
          }
        >
          {(close) => (
            <div className="Create-group bg-dark shadow rounded mx-3 px-5 pb-5 pt-5">
              <h3 className="text-center ">Create Group</h3>
              <hr className="pb-1" />
              <div class="form-group mb-4">
                <label>Group Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Group Name"
                  value={GroupName}
                  onChange={(e) => {
                    setGroupName(e.target.value);
                  }}
                />
              </div>
              <div class="custom-control custom-switch">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="customSwitch1"
                  style={{ color: "rgb(255, 119, 51)" }}
                  onChange={() => {
                    setPrivate(!Private);
                  }}
                />
                <label class="custom-control-label" for="customSwitch1">
                  Privite Group
                </label>
              </div>
              <div className="d-flex justify-content-around align-items-center">
                <button
                  type="button"
                  className="mt-4 btn btn-success"
                  onClick={(e) => {
                    CreateGroupHandler(e);
                    close();
                  }}
                >
                  Create Group
                </button>
                <button
                  type="button"
                  className="mt-4 btn btn-danger"
                  onClick={() => {
                    close();
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </Popup>
      </div>
      <SimpleBar
        className=" SimpleBar shadow bg-white rounded"
        autoHide={true}
        scrollbarMaxSize={45}
      >
        {Loading ? (
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : showMyGroups ? (
          Mygroups.map((group) => {
            return (
              <div
                key={group._id}
                className="mb-3 d-flex justify-content-between align-items-center bg-secondary rounded px-3"
              >
                <GroupIcon style={{ color: "rgb(255, 119, 51)" }} />
                <div>
                  <p>{group.name}</p>
                </div>
                <button
                  className="btn p-0"
                  style={{ color: "rgb(255, 119, 51)" }}
                  onClick={() => {
                    Unsubscribe(group._id);
                  }}
                >
                  <DeleteIcon />
                </button>
              </div>
            );
          })
        ) : (
          AdminGroups.map((group) => {
            return (
              <div
                key={group._id}
                className="mb-3 d-flex justify-content-between align-items-center bg-secondary rounded px-3"
              >
                <GroupIcon style={{ color: "rgb(255, 119, 51)" }} />
                <div>
                  <p>{group.name}</p>
                </div>
                <Popup
                  trigger={
                    <button className="btn">
                      <VpnKeyIcon
                        style={{ color: "rgb(255, 119, 51)" }}
                        onClick={() => {
                          setInviteKey(group._id);
                        }}
                      />
                    </button>
                  }
                >
                  <div className="bg-dark rounded px-3 pb-3 pt-3">
                    {InviteKey}
                  </div>
                </Popup>
                <Popup
                  modal
                  trigger={
                    <button
                      className="btn p-0"
                      style={{ color: "rgb(255, 119, 51)" }}
                    >
                      <DeleteIcon />
                    </button>
                  }
                >
                  {(close) => (
                    <div className="bg-white shadow rounded mx-3 px-5 pb-5 pt-5">
                      <h6>Your are deleting a group !</h6>
                      <p>
                        When you delete this group you and subscribers of this
                        group cant use this group again !
                      </p>
                      <p>Are you sure you wanna delete this Group</p>
                      <hr />
                      <div className="d-flex justify-content-around align-items-center">
                        <button
                          type="button"
                          className="btn btn-success px-5"
                          onClick={() => {
                            Delete(group._id);
                            close();
                          }}
                        >
                          Delete
                        </button>
                        <button
                          className="btn btn-danger px-5"
                          onClick={() => {
                            close();
                          }}
                        >
                          Abort
                        </button>
                      </div>
                    </div>
                  )}
                </Popup>
              </div>
            );
          })
        )}
      </SimpleBar>
    </div>
  );
}

export default MyGroups;
