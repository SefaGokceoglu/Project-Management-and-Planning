import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import "./Projects.css";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import axios from "axios";
import Project from "./Project/Project";
import CreateNewFolderIcon from "@material-ui/icons/CreateNewFolder";
import AddBoxIcon from "@material-ui/icons/AddBox";
import AddIcon from "@material-ui/icons/Add";
function Projects() {
  const [SelectedProject, setSelectedProject] = useState("");
  const [Projects, setProjects] = useState([]);
  const [ProjectName, setProjectName] = useState("");
  const [startAt, setstartAt] = useState(new Date());
  const [endAt, setendAt] = useState(new Date());
  const [ProjectKey, setProjectKey] = useState("");
  useEffect(async () => {
    const response = await axios.get("http://localhost:7000/project");

    if (response && response.data) {
      setProjects(response.data);
    }
  }, []);
  const SelectProjectHandler = (e) => {
    setSelectedProject(e.target.value);
  };

  const CreateProject = async () => {
    const response = await axios.post("http://localhost:7000/project", {
      name: ProjectName,
      startAt,
      endAt,
    });

    if (response && response.data) {
      setProjects([...Projects, response.data]);
    }
  };

  const JoinProject = async () => {
    const response = await axios.post(
      `http://localhost:7000/project/join/${ProjectKey}`
    );

    if (response && response.data) {
      setProjects([...Projects, response.data]);
    }
  };

  return (
    <div className="fullHeight bg-secondary">
      <h1 className="bg-secondary text-center m-0 pt-5">Projects</h1>
      <div className=" d-flex justify-content-around bg-secondary pb-4">
        <div className="form-group bg-secondary  m-0 ">
          <label htmlFor="SelectProject">Select a Project</label>
          <select
            value={SelectedProject.name}
            onChange={SelectProjectHandler}
            className="form-control"
            id="SelectProject"
          >
            <option value="">None</option>
            {Projects.map((project) => {
              return (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="d-flex justify-content-between align">
          <Popup
            modal
            trigger={
              <button
                className="btn border-0"
                style={{ color: "rgb(255, 119, 51)" }}
              >
                <CreateNewFolderIcon />
                <p className="m-0">Create Project</p>
              </button>
            }
          >
            {(close) => (
              <div className="Create-Project bg-white shadow rounded mx-3 px-5 pb-5 pt-5">
                <h6 className="text-center">Create Poject !</h6>
                <hr />
                <div className="form-group">
                  <label htmlFor="InputProjectName">Task Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="InputProjectName"
                    placeholder="Project Name"
                    value={ProjectName}
                    onChange={(e) => {
                      setProjectName(e.target.value);
                    }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="StartDate">Start Date </label>
                  <DatePicker
                    className="form-control"
                    selected={startAt}
                    dateFormat="dd/MM/yyyy"
                    onChange={(date) => {
                      setstartAt(date);
                    }}
                    startDate={startAt}
                    endDate={endAt}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="StartDate">End Date </label>
                  <DatePicker
                    className="form-control"
                    selected={endAt}
                    dateFormat="dd/MM/yyyy"
                    startDate={startAt}
                    endDate={endAt}
                    minDate={startAt}
                    onChange={(date) => setendAt(date)}
                  />
                </div>
                <div className="d-flex justify-content-around align-items-center">
                  <button
                    type="button"
                    className="btn btn-success px-5"
                    onClick={() => {
                      CreateProject();
                      close();
                    }}
                  >
                    Create
                  </button>
                  <button
                    className="btn btn-danger px-5"
                    onClick={() => {
                      close();
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </Popup>
          <Popup
            trigger={
              <button
                className="btn border-0"
                style={{ color: "rgb(255, 119, 51)" }}
              >
                <AddBoxIcon />
                <p className="m-0">Join Project</p>
              </button>
            }
          >
            <div className="bg-dark rounded px-3 pb-3 pt-3 border-0">
              <div className="d-flex justify-content-between align-items-center">
                <label htmlFor="InputProjectKey" className="m-0">
                  Key
                </label>
                <input
                  type="password"
                  className="form-control ml-3"
                  id="InputProjectKey"
                  placeholder="Project Invite Key"
                  value={ProjectKey}
                  onChange={(e) => {
                    setProjectKey(e.target.value);
                  }}
                />
                <button
                  className="btn border-0"
                  style={{ color: "rgb(255, 119, 51)" }}
                  onClick={JoinProject}
                >
                  <AddIcon />
                </button>
              </div>
            </div>
          </Popup>
          {SelectedProject ? (
            <Popup
              trigger={
                <button
                  className="btn border-0"
                  style={{ color: "rgb(255, 119, 51)" }}
                >
                  <VpnKeyIcon />
                  <p className="m-0">Invite Key</p>
                </button>
              }
            >
              <div className="bg-dark rounded px-3 pb-3 pt-3">
                {SelectedProject}
              </div>
            </Popup>
          ) : null}
        </div>
      </div>
      {SelectedProject ? <Project SelectedProject={SelectedProject} /> : null}
    </div>
  );
}

export default Projects;
