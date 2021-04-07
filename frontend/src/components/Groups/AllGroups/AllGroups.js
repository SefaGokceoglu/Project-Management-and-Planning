import React, { useState } from "react";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import GroupIcon from "@material-ui/icons/Group";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import AddIcon from "@material-ui/icons/Add";
import axios from "axios";
function AllGroups({
  Allgroups,
  Loading,
  setMygroups,
  Mygroups,
  setAllgroups,
}) {
  const [GroupKey, setGroupKey] = useState("");

  const JoinPrivateHandler = async () => {
    const response = await axios.post(
      `http://localhost:7000/groups/subscribe/${GroupKey}`
    );

    if (response && response.data) {
      setMygroups([...Mygroups, response.data]);
    }

    setGroupKey("");
  };

  const JoinPublicHandler = async (PublicGroupKey) => {
    const response = await axios.post(
      `http://localhost:7000/groups/subscribe/${PublicGroupKey}`
    );

    if (response && response.data) {
      setMygroups([...Mygroups, response.data]);
    }

    const filterArray = Allgroups.filter(
      (group) => group._id !== response.data._id
    );

    setAllgroups(filterArray);
  };
  return (
    <SimpleBar
      className="shadow bg-white rounded AllGroups"
      autoHide={true}
      scrollbarMaxSize={45}
    >
      <div className="px-5 pt-5">
        <div className="pb-3 pt-3 d-flex justify-content-between align-items-center bg-dark rounded shadow">
          <p
            className="ml-5 text-center "
            style={{ color: "rgb(255, 119, 51)" }}
          >
            Community Groups
          </p>
          <div className="d-flex justify-content-between align-items-center">
            <input
              className="form-control mx-0"
              type="password"
              placeholder="Private Invite Key"
              onChange={(e) => {
                setGroupKey(e.target.value);
              }}
              value={GroupKey}
            />
            <button
              className="btn"
              style={{ color: "rgb(255, 119, 51)" }}
              onClick={JoinPrivateHandler}
            >
              <AddIcon />
            </button>
          </div>
        </div>
        <hr />
        {Loading ? (
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          Allgroups.map((group) => {
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
                    JoinPublicHandler(group._id);
                  }}
                >
                  <GroupAddIcon />
                </button>
              </div>
            );
          })
        )}
      </div>
    </SimpleBar>
  );
}

export default AllGroups;
