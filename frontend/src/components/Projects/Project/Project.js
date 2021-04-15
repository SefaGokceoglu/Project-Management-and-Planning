import React, { useState, useEffect, useRef } from "react";
import Chart from "react-google-charts";
import axios from "axios";
import TaskForm from "../TaskForm/TaskForm";
import SaveIcon from "@material-ui/icons/Save";
import ReplayIcon from "@material-ui/icons/Replay";
import DeleteIcon from "@material-ui/icons/Delete";
function Project({ SelectedProject }) {
  const [Loading, setLoading] = useState(true);
  const [Project, setProject] = useState("");

  const [UpdateTask, setUpdateTask] = useState("");

  const DataSchema = [
    { type: "string", label: "Task ID" },
    { type: "string", label: "Task Name" },
    { type: "string", label: "Resource" },
    { type: "date", label: "Start Date" },
    { type: "date", label: "End Date" },
    { type: "number", label: "Duration" },
    { type: "number", label: "Percent Complete" },
    { type: "string", label: "Dependencies" },
  ];
  const [Data, setData] = useState([]);
  useEffect(async () => {
    const response = await axios.post(
      `http://localhost:7000/project/${SelectedProject}`
    );

    if (response && response.data) {
      setProject(response.data);
      const GetData = response.data.SelectedProject.data;
      const DataFromDb = GetData.map((data) => {
        return [
          data.TaskName,
          data.TaskName,
          data.Resource,
          new Date(data.StartDate),
          new Date(data.EndDate),
          null,
          data.Percent,
          data.Dependencies,
        ];
      });
      setData(DataFromDb);
    }

    setLoading(false);
  }, [SelectedProject]);

  const prevDataRef = useRef();

  useEffect(() => {
    prevDataRef.current = Data;
  });
  const prevData = prevDataRef.current;

  const SaveData = async () => {
    await axios.patch(`http://localhost:7000/project/save/${SelectedProject}`, {
      Data,
    });
  };
  const Undo = () => {
    setData(prevData);
  };

  if (Loading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  } else {
    return (
      <div className="Container bg-secondary d-flex justify-content-center align-items-center">
        <div className="Chart-Container d-flex justify-content-center align-items-center bg-secondary ">
          {Data.length > 0 ? (
            <Chart
              height={`${Data.length * 200}px`}
              width={"90%"}
              chartType="Gantt"
              loader={
                <div className="d-flex justify-content-center">
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              }
              options={{
                backgroundColor: {
                  fill: "#6c757d",
                },
                gantt: {
                  innerGridHorizLine: {
                    strokeWidth: 0,
                  },
                  innerGridDarkTrack: {
                    fill: "#6c757d",
                  },
                  innerGridTrack: {
                    fill: "#6c757d",
                  },
                },
              }}
              data={[DataSchema, ...Data]}
            />
          ) : (
            <div className="d-flex justify-content-center">
              <div
                className="shadow rounded p-4"
                style={{ color: "rgb(255, 119, 51)" }}
              >
                <h2>This Project Doesnt Have Tasks Yet </h2>
                <h4> Add Task From Task Form</h4>
              </div>
            </div>
          )}
        </div>
        <div className="d-flex align-items-center justify-content-around p-5 bg-secondary">
          <TaskForm
            Loading={Loading}
            Data={Data}
            setData={setData}
            Team={Project.Team}
            Project={Project.SelectedProject}
          />
          <div className="Button-Container bg-secondary">
            <div className="m-5">
              <button
                className="Project-Data-Button btn btn-success d-flex justify-content-center align-items-center"
                onClick={SaveData}
              >
                <SaveIcon className="m-2" />
                <p className="m-0">Save Chart</p>
              </button>
            </div>
            <div className="m-5">
              <button
                className="Project-Data-Button btn btn-warning d-flex justify-content-center align-items-center"
                onClick={Undo}
              >
                <ReplayIcon className="m-2" />
                <p className="m-0">Undo Last</p>
              </button>
            </div>
            <div className="m-5">
              <button
                className="Project-Data-Button btn btn-danger d-flex justify-content-center align-items-center"
                onClick={() => {
                  setData([]);
                }}
              >
                <DeleteIcon className="m-2" />
                <p className="m-0">Delete Chart</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Project;
