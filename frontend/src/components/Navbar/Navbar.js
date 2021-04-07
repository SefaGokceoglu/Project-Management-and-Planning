import React from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
function Navbar({ User, setUser }) {
  const LogoutHandler = async (e) => {
    e.preventDefault();
    await axios.get("http://localhost:7000/users/logout");
    setUser("");
    sessionStorage.clear();
    window.location.assign("/");
  };
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <NavLink
          className="navbar-brand"
          exact
          to="/"
          style={{ color: "rgb(255, 119, 51)" }}
        >
          Navbar
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{ backgroundColor: "rgb(255, 119, 51)" }}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item ">
              <NavLink
                className="nav-link"
                exact
                activeClassName="active"
                activeStyle={{ color: "rgb(255, 119, 51)" }}
                to="/Home"
              >
                Home
              </NavLink>
            </li>
            {User ? (
              <>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    exact
                    activeClassName="active"
                    to="/Projects"
                    activeStyle={{ color: "rgb(255, 119, 51)" }}
                  >
                    Projects
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    exact
                    activeClassName="active"
                    to="/Groups"
                    activeStyle={{ color: "rgb(255, 119, 51)" }}
                  >
                    Groups
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    exact
                    activeClassName="active"
                    to="/Chats"
                    activeStyle={{ color: "rgb(255, 119, 51)" }}
                  >
                    Chats
                  </NavLink>
                </li>
              </>
            ) : null}
          </ul>
          {!User ? (
            <ul className="navbar-nav mr-0">
              <li className="nav-item ">
                <NavLink
                  className="nav-link"
                  exact
                  activeClassName="active"
                  to="/Register"
                  activeStyle={{ color: "rgb(255, 119, 51)" }}
                >
                  Register
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  exact
                  activeClassName="active"
                  to="/Login"
                  activeStyle={{ color: "rgb(255, 119, 51)" }}
                >
                  Login
                </NavLink>
              </li>
            </ul>
          ) : (
            <ul className="navbar-nav mr-0">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle mr-3"
                  href="/#"
                  id="navbarDropdownMenuLink"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                  style={{ color: "rgb(255, 119, 51)" }}
                >
                  <AccountCircleIcon className="mr-3" />
                  {User}
                </a>
                <div
                  className="dropdown-menu bg-secondary"
                  aria-labelledby="navbarDropdownMenuLink"
                  style={{ color: "rgb(255, 119, 51)" }}
                >
                  <NavLink
                    className="dropdown-item bg-secondary"
                    exact
                    to="/Account"
                  >
                    Account
                  </NavLink>
                  <NavLink
                    className="dropdown-item bg-secondary"
                    to="/Main"
                    onClick={LogoutHandler}
                  >
                    Log Out
                  </NavLink>
                </div>
              </li>
            </ul>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
