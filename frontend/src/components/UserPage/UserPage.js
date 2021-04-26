import React, { useEffect, useState, useRef } from "react";
import "./UserPage.css";
import Accountİmage from "./default-user-image.png";
import axios from "axios";
import alertify from "alertifyjs";
import AssignmentIcon from "@material-ui/icons/Assignment";
import GroupIcon from "@material-ui/icons/Group";
import { useParams } from "react-router-dom";
import SimpleBar from "simplebar-react";
function UserPage({ UserProfileURL }) {
  const [Loading, setLoading] = useState(true);
  const [UserInfo, setUserInfo] = useState(false);
  const { user } = useParams();
  const [SelectProfilePicture, setSelectProfilePicture] = useState();
  const [ProfilePicture, setProfilePicture] = useState();
  const FileInput = useRef();
  useEffect(() => {
    async function getUserData() {
      const response = await axios
        .get(`http://localhost:7000/users/${user}`)
        .catch((err) => {
          alertify.notify(err.response.data.msg, "error", 5);
        });

      if (response && response.data) {
        setUserInfo(response.data);
        if (response.data.User.ProfileImg) {
          const buffer = new Buffer(response.data.User.ProfileImg.data);
          const base64 = buffer.toString("base64");
          setProfilePicture(
            `data:${response.data.User.ProfileImg.mimetype};base64, ${base64}`
          );
        }
      }

      setLoading(false);
    }

    getUserData();
  }, [user]);
  useEffect(() => {
    if (SelectProfilePicture) {
      alertify.notify("Profile Picture is Updating ", "warning", 5);
      async function UploadImage() {
        const formData = new FormData();
        formData.append("image", SelectProfilePicture);
        const response = await axios.post(
          "http://localhost:7000/users/image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response && response.data) {
          alertify.notify(response.data.msg, "success", 5);
          const reader = new FileReader();
          reader.onloadend = () => {
            setProfilePicture(reader.result);
          };
          reader.readAsDataURL(SelectProfilePicture);
        }
      }
      UploadImage();
    }
  }, [SelectProfilePicture]);
  let admin;
  console.log("/" + user === UserProfileURL);
  "/" + user === UserProfileURL ? (admin = "admin") : (admin = "");
  if (!Loading) {
    if (!UserInfo) {
      return (
        <div className="fullheight bg-secondary d-flex justify-content-center align-items-center">
          <h3>This User Doesnt Exists</h3>
        </div>
      );
    } else {
      return (
        <div className="fullheight bg-secondary d-flex justify-content-center align-items-center">
          <div className="User-Container bg-dark  rounded grid-container text-white">
            <div className="d-flex flex-column ">
              <p>Click On İmage To Change Pofile İmage</p>
              {UserInfo.User.ProfileImg ? (
                <img
                  className={"Account-Image " + admin}
                  src={ProfilePicture}
                  alt="User İmage"
                  onClick={() => {
                    if (admin) {
                      FileInput.current.click();
                    }
                  }}
                />
              ) : (
                <img
                  className={"Account-Image " + admin}
                  src={Accountİmage}
                  alt="User İmage"
                  onClick={() => {
                    if (admin) {
                      FileInput.current.click();
                    }
                  }}
                />
              )}
              {!admin ? null : (
                <input
                  type="file"
                  style={{ display: "none" }}
                  ref={FileInput}
                  accept="image/*"
                  onChange={(e) => setSelectProfilePicture(e.target.files[0])}
                />
              )}
              <div className="ml-1 mt-2">
                <h4 className="m-3">{UserInfo.User.name}</h4>
                <h4 className="m-3">{UserInfo.User.lastname}</h4>
                <h5 className="m-3">{UserInfo.User.email}</h5>
              </div>
            </div>
            <div>
              <div className="h-50">
                <h6 className="text-center m-0">Projects</h6>
                <SimpleBar
                  className="bg-dark UserPage-SimpleBar UserPage-Projects-SimpleBar p-1  "
                  autoHide={true}
                  scrollbarMinSize={20}
                >
                  {UserInfo.Projects.map((project) => {
                    return (
                      <div key={project.Project._id}>
                        <div className=" Project-Container bg-secondary  rounded m-4">
                          <div className="d-flex justify-content-center align-items-center">
                            <AssignmentIcon />
                            <h6 className=" ml-1 m-0">
                              Project Name : {project.Project.name}
                            </h6>
                          </div>
                          <p className="m-2">
                            Creator : {project.Admin.name}{" "}
                            {project.Admin.lastname}
                          </p>
                          <p className="m-2"></p>
                          <p className="m-2">
                            Creator Mail : {project.Admin.email}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </SimpleBar>
              </div>
              <div className="mt-2">
                <h6 className="text-center m-0">Groups</h6>
                <SimpleBar
                  className="bg-dark UserPage-SimpleBar UserPage-Groups-SimpleBar p-1 "
                  autoHide={true}
                  scrollbarMinSize={20}
                >
                  {UserInfo.Groups.map((group) => {
                    return (
                      <div key={group._id}>
                        <div className=" Project-Container bg-secondary shadow rounded m-4">
                          <div className="d-flex justify-content-center align-items-center">
                            <GroupIcon />
                            <h6 className=" ml-1 m-0">
                              Group Name : {group.name}
                            </h6>
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
  } else {
    return (
      <div className="fullheight bg-secondary d-flex align-items-center justify-content-center">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  }
}

export default UserPage;
