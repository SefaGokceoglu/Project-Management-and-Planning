import React, { useEffect, useState } from "react";
import "./UserPage.css";
import axios from "axios";
import alertify from "alertifyjs";
import { useParams } from "react-router-dom";
function UserPage() {
  const [Loading, setLoading] = useState(true);
  const [UserInfo, setUserInfo] = useState(false);
  const { user } = useParams();
  useEffect(() => {
    async function getUserData() {
      const response = await axios
        .get(`http://localhost:7000/users/${user}`)
        .catch((err) => {
          alertify.notify(err.response.data.msg, "error", 5);
        });

      if (response && response.data) {
        setUserInfo(response.data);
        console.log(response.data);
      }
      setLoading(false);
    }

    getUserData();
  }, []);
  if (!Loading) {
    if (!UserInfo) {
      console.log("No user");
      return (
        <div className="fullheight bg-secondary">This User Dont Exists</div>
      );
    } else {
      return <div className="fullheight bg-secondary">UserPage</div>;
    }
  } else {
    return <div className="fullheight bg-secondary"></div>;
  }
}

export default UserPage;
