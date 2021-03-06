import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import CloseIcon from "@material-ui/icons/Close";
import axios from "axios";
import "./Login.css";
import alertify from "alertifyjs";
function Login({ User, setUser }) {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const SubmitHandler = async (e) => {
    e.preventDefault();

    const user = {
      email: Email,
      password: Password,
    };

    const response = await axios
      .post("http://localhost:7000/users/login", user)
      .catch((err) => {
        alertify.set("notifier", "position", "top-center");
        alertify.error(err.response.data.msg);
      });

    if (response && response.data) {
      alertify.notify("Successfully Loged In", "success", 5);
      sessionStorage.setItem(
        "username",
        response.data.name + " " + response.data.lastname
      );

      setUser(response.data.name + " " + response.data.lastname);
      //return <Redirect exact to="/" />;
    }
  };
  if (!User) {
    return (
      <div className="Login d-flex justify-content-center align-items-center shadow bg-white rounded">
        <form className="Login-Form mb-1">
          <h1 className="text-center mb-3">SIGN IN</h1>
          <div className="mb-4">
            <label htmlFor="exampleInputEmail1" class="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              value={Email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className="mb-4">
            <label for="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              value={Password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <div class="mb-4 ">
            <p>
              Dont Have an Account ?
              <Link className="pl-5" to="/Register">
                Register Now !
              </Link>
            </p>
          </div>
          <button
            className="btn Submit-Button"
            type="submit"
            onClick={SubmitHandler}
          >
            Submit
          </button>
        </form>
      </div>
    );
  } else {
    return <Redirect to="/" />;
  }
}

export default Login;
