import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import "alertifyjs/build/css/alertify.css";
import "popper.js";
import "jquery";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";
import "simplebar/dist/simplebar.min.css";
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
