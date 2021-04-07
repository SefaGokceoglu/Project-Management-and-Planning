import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import axios from "axios";
import MultiSelect from "react-multi-select-component";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";
import TaskSelect from "../TaskSelect/TaskSelect";
function TaskForm({ Loading, Data, setData, Team, Project }) {
  const [StartDate, setStartDate] = useState(
    new Date(new Date().setHours(0, 0, 0, 0))
  );
  const [EndDate, setEndDate] = useState(
    new Date(new Date().setHours(0, 0, 0, 0))
  );
  const [TaskName, setTaskName] = useState("");
  const [Resource, setResource] = useState([]);
  const [Dependencies, setDependencies] = useState([]);
  const [Percent, setPercent] = useState(0);

  const [UptadeTask, setUptadeTask] = useState("");

  const AddTaskHandler = async (e) => {
    e.preventDefault();
    const Resources = Resource.map((person) => {
      return person.value;
    });
    const DependenciesString = Dependencies.map((task) => {
      return task.value;
    });

    const NewTask = [
      TaskName,
      TaskName,
      Resources.toString(),
      StartDate,
      EndDate,
      null,
      Percent,
      DependenciesString.toString(),
    ];
    if (StartDate !== EndDate && TaskName !== "") {
      setData([...Data, NewTask]);
    }
  };

  const People = Team.map((person) => {
    return {
      label: person.name + " " + person.lastname,
      value: person.name + " " + person.lastname,
    };
  });

  useEffect(() => {
    if (UptadeTask !== "") {
      const string = "asdaasdas";
      console.log(string.split(","));

      Data.find((task) => {
        if (task[0] === UptadeTask) {
          console.log(task);
          setTaskName(task[0]);
          task[2] !== ""
            ? setResource(task[2].split(","))
            : task[2].includes(",")
            ? setResource([task[2]])
            : setResource([]);
          setStartDate(new Date(task[3]));
          setEndDate(new Date(task[4]));
        }
      });
    } else {
      setTaskName("");
      setStartDate(new Date(new Date().setHours(0, 0, 0, 0)));
      setEndDate(new Date(new Date().setHours(0, 0, 0, 0)));
      setResource([]);
      setDependencies([]);
      setPercent(0);
    }
  }, [UptadeTask]);

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
      <div className="Task-Container rounded bg-white p-5">
        <div>
          <div>
            {Data.length > 0 ? (
              <div className="form-group">
                <label htmlFor="SelectUpdateTask">Select Task to Update</label>
                <select
                  value={UptadeTask}
                  onChange={(e) => {
                    console.log(e.target.value);
                    setUptadeTask(e.target.value);
                  }}
                  className="form-control"
                  id="SelectUpdateTask"
                >
                  <option value="">Select Task</option>
                  {Data.map((task) => {
                    return <option value={task[0]}>{task[0]}</option>;
                  })}
                </select>
              </div>
            ) : null}
          </div>
          <h2 className="text-center p-2"> TASK FORM</h2>
          <form>
            <div className="form-group">
              <label htmlFor="InputTaskName">Task Name</label>
              <input
                type="text"
                className="form-control"
                id="InputTaskName"
                placeholder="Task Name"
                value={TaskName}
                onChange={(e) => {
                  setTaskName(e.target.value);
                }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="Assign">Assign To</label>
              <MultiSelect
                options={People}
                value={Resource}
                onChange={setResource}
                labelledBy="Assign To .. "
              />
            </div>
            <div className="form-group">
              <label htmlFor="StartDate">Start Date </label>
              <DatePicker
                className="form-control"
                selected={StartDate}
                dateFormat="dd/MM/yyyy"
                onChange={(date) => {
                  setStartDate(date);
                  console.log(date);
                }}
                startDate={StartDate}
                endDate={EndDate}
              />
            </div>
            <div className="form-group">
              <label htmlFor="StartDate">End Date </label>
              <DatePicker
                className="form-control"
                selected={EndDate}
                dateFormat="dd/MM/yyyy"
                startDate={StartDate}
                endDate={EndDate}
                minDate={StartDate}
                onChange={(date) => setEndDate(date)}
              />
            </div>
            {Data.length > 0 ? (
              <div className="form-group">
                <label htmlFor="Dependencies">Dependent Tasks</label>
                <TaskSelect
                  Data={Data}
                  setDependencies={setDependencies}
                  Dependencies={Dependencies}
                />
              </div>
            ) : null}

            <div className="form-group mb-5">
              <label htmlFor="InputTaskProgress">Task Progress</label>
              <InputRange
                className="mb-5"
                maxValue={100}
                minValue={0}
                value={Percent}
                onChange={(value) => {
                  setPercent(value);
                }}
              />
            </div>
            <button className="btn btn-secondary" onClick={AddTaskHandler}>
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default TaskForm;
