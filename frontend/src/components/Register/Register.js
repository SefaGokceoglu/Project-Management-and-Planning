import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import CloseIcon from "@material-ui/icons/Close";
import "./Register.css";
function Register({ User, setUser }) {
  const [Name, setName] = useState("");
  const [Lastname, setLastname] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [CPassword, setCPassword] = useState("");

  const [Error, setError] = useState("");

  const SubmitHandler = async (e) => {
    e.preventDefault();

    const user = {
      name: Name,
      lastname: Lastname,
      email: Email,
      password: Password,
      passwordVerify: CPassword,
    };
    const response = await axios
      .post("http://localhost:7000/users/register", user)
      .catch((err) => {
        console.log(err);
        setError(err.response.data.msg);
      });
    if (response && response.data) {
      sessionStorage.setItem("username", response.data.name);
      setUser(response.data.name);
    }
  };
  if (!User) {
    return (
      <div className="Register d-flex justify-content-center align-items-center shadow bg-white rounded">
        <form className="Register-Form mb-1">
          <h1 className="text-center mb-2">SIGN UP</h1>
          {Error ? (
            <div
              className="alert alert-warning d-flex justify-content-between align-items-center"
              role="alert"
            >
              {Error}
              <button
                type="button"
                className="close btn"
                data-bs-dismiss="alert"
                aria-label="Close"
                onClick={() => setError("")}
              >
                <CloseIcon />
              </button>
            </div>
          ) : null}
          <div className="mb-4">
            <label htmlFor="exampleInput1" class="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="exampleInput1"
              value={Name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="exampleInput2" class="form-label">
              Last Name
            </label>
            <input
              type="text"
              className="form-control"
              id="exampleInput2"
              value={Lastname}
              onChange={(e) => {
                setLastname(e.target.value);
              }}
            />
          </div>
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
          <div className="mb-4">
            <label for="exampleInputPassword2" className="form-label">
              Password Confirm
            </label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword2"
              value={CPassword}
              onChange={(e) => {
                setCPassword(e.target.value);
              }}
            />
          </div>
          <div class="mb-4 ">
            <p>
              Have an Account ?
              <Link className="pl-5" to="/Login">
                Login Now !
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

export default Register;
