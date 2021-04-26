import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Account from "./components/Account/Account";
import Chats from "./components/Chats/Chats";
import Groups from "./components/Groups/Groups";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Main from "./components/Main/Main";
import Navbar from "./components/Navbar/Navbar";
import Projects from "./components/Projects/Projects";
import Register from "./components/Register/Register";

import axios from "axios";
import UserPage from "./components/UserPage/UserPage";
axios.defaults.withCredentials = true;

function App() {
  const [User, setUser] = useState("");
  const [UserProfileURL, setUserProfileURL] = useState("");
  useEffect(() => {
    const loggedInUser = sessionStorage.getItem("username");

    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  useEffect(() => {
    async function GetUserLink() {
      const response = await axios.get(
        "http://localhost:7000/users/account/link"
      );

      if (response && response.data) {
        setUserProfileURL(response.data);
      }
    }
    if (User) GetUserLink();
  }, [User]);
  return (
    <Router>
      <Navbar User={User} setUser={setUser} UserProfileURL={UserProfileURL} />
      <Switch>
        <Route path="/Home">
          <Home />
        </Route>
        <Route exact path="/">
          <Main />
        </Route>
        <Route path="/Projects">
          <Projects />
        </Route>
        <Route path="/Groups">
          <Groups User={User} />
        </Route>
        <Route path="/Chats">
          <Chats User={User} UserProfileURL={UserProfileURL} />
        </Route>
        <Route path="/Register">
          <Register User={User} setUser={setUser} />
        </Route>
        <Route path="/Login">
          <Login User={User} setUser={setUser} />
        </Route>
        <Route path="/:user">
          <UserPage UserProfileURL={UserProfileURL} />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
