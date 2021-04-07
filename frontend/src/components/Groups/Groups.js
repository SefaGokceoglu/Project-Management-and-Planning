import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Groups.css";
import "reactjs-popup/dist/index.css";
import MyGroups from "./MyGroups/MyGroups";
import AllGroups from "./AllGroups/AllGroups";
function Groups({ User }) {
  const [Mygroups, setMygroups] = useState([]);
  const [Allgroups, setAllgroups] = useState([]);
  const [AdminGroups, setAdminGroups] = useState([]);
  const [Loading, setLoading] = useState(true);

  async function fetchData() {
    const response = await axios.get("http://localhost:7000/groups");
    if (response && response.data) {
      setMygroups(response.data.UserGroups);
      setAllgroups(response.data.AllGroups);
      setAdminGroups(response.data.CreatedGroups);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className="container-xlg bg-secondary mb-5">
        <h1 className="text-center pt-3 pb-2">Hello {User}</h1>
        <h5 className="pl-5 pb-2">This page is Groups Page</h5>
        <h6 className="pl-5 pb-1">
          You can simply interract with this appllication and Join Groups or
          Create you Own Group for people to use.
        </h6>
        <h6 className="pl-5 pb-3">
          İf you are already in a Group you can see that here. You can leave
          your groups here.
        </h6>
      </div>
      <div className="Group-Container px-5">
        <MyGroups
          Mygroups={Mygroups}
          Loading={Loading}
          AdminGroups={AdminGroups}
          setMygroups={setMygroups}
          setAllgroups={setAllgroups}
          Allgroups={Allgroups}
          setAdminGroups={setAdminGroups}
        />
        <AllGroups
          Allgroups={Allgroups}
          Loading={Loading}
          Mygroups={Mygroups}
          setMygroups={setMygroups}
          setAllgroups={setAllgroups}
        />
      </div>
    </div>
  );
}

export default Groups;
