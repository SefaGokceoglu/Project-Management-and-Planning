import React, { useState, useEffect, useRef } from "react";
import Chart from "react-google-charts";
import axios from "axios";
import TaskForm from "../TaskForm/TaskForm";
import TaskSelect from "../TaskSelect/TaskSelect";
function Project({ SelectedProject }) {
  const [Loading, setLoading] = useState(true);
  const [Project, setProject] = useState("");
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
      if (response.data.SelectedProject.data.length === 0) {
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
      } else {
        const DataFromDb = response.data.SelectedProject.data;
        console.log(DataFromDb);
        const ArrayData = DataFromDb.map((data) => {
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
        setData(ArrayData);
      }
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
      <div className="Container bg-secondary">
        <div className="Chart-Container bg-secondary">
          {Data.length > 0 ? (
            <Chart
              height={`${Data.length * 200}px`}
              width={"100%"}
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
          <div className="Projects-Container bg-secondary "></div>
          <div className="Tasks-Container bg-secondary">
            <div>
              <button className="btn btn-success" onClick={SaveData}>
                Save Chart
              </button>
              <button className="btn btn-warning" onClick={Undo}>
                Undo Last
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Project;
