import React, { useState } from "react";
import axios from "axios";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import AddIcon from "@material-ui/icons/Add";
import Popup from "reactjs-popup";
import "./KanbanBoard.css";
function KanbanBoard({ Project, SelectedProject }) {
  const [Board, setBoard] = useState(Project.SelectedProject.Board);
  const [taskLabel, settaskLabel] = useState("");
  const [taskDescription, settaskDescription] = useState("");
  const Tables = ["To Do", "In Progress", "Done"];

  const AddTask = async (column) => {
    if (taskLabel.length == 0) {
      return;
    }
    Board[column].push({
      label: taskLabel,
      description: taskDescription,
    });

    const response = await axios.patch(
      `http://localhost:7000/project/update/${SelectedProject}`,
      {
        Data: Board,
      }
    );

    if (response && response.data) {
      console.log(response.data);
      setBoard(response.data);
    }
  };

  const onDragEnd = async (result, Board, setBoard) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = source.droppableId;
      const destColumn = destination.droppableId;
      const sourceitems = Board[sourceColumn];
      const destitems = Board[destColumn];
      const removed = sourceitems.splice(source.index, 1);
      destitems.splice(destination.index, 0, ...removed);
      setBoard({
        ...Board,
        [sourceColumn]: [...sourceitems],
        [destColumn]: [...destitems],
      });
    } else {
      const column = source.droppableId;
      const Arr = Board[column];
      const [removed] = Arr.splice(source.index, 1);
      Arr.splice(destination.index, 0, removed);

      setBoard({
        ...Board,
        [column]: [...Arr],
      });
    }

    const response = await axios.patch(
      `http://localhost:7000/project/update/${SelectedProject}`,
      {
        Data: Board,
      }
    );

    if (response && response.data) {
      console.log(response.data);
      setBoard(response.data);
    }
  };
  return (
    <DragDropContext onDragEnd={(result) => onDragEnd(result, Board, setBoard)}>
      <div className="kanban-grid-container">
        {Object.keys(Board).map((column, index) => {
          return (
            <div key={index} className="mt-3 mb-5 mx-5 rounded">
              <div className="d-flex align-items-center justify-content-between bg-orange">
                <h3 className="m-2 text-center ">{Tables[index]}</h3>
                <Popup
                  modal
                  trigger={
                    <button className="btn">
                      <AddIcon />
                    </button>
                  }
                >
                  {(close) => (
                    <div className="bg-white rounded text-dark p-5 add-to-table">
                      <h6 className="text-center">
                        Add to {Tables[index]} Table
                      </h6>
                      <hr />
                      <div className="form-group">
                        <label htmlFor="InputTaskLabel">Task Label</label>
                        <input
                          type="text"
                          className="form-control"
                          id="InputTaskLabel"
                          placeholder="Task Label"
                          value={taskLabel}
                          onChange={(e) => {
                            settaskLabel(e.target.value);
                          }}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="InputTaskDesc">Task Description</label>
                        <textarea
                          type="text"
                          className="form-control"
                          id="InputTaskDesc"
                          rows="5"
                          placeholder="Description for the Task"
                          value={taskDescription}
                          onChange={(e) => {
                            settaskDescription(e.target.value);
                          }}
                        />
                      </div>
                      <div className="d-flex justify-content-around align-items-center">
                        <button
                          type="button"
                          className="btn btn-success px-2"
                          onClick={() => {
                            AddTask(column);
                            close();
                          }}
                        >
                          Add
                        </button>
                        <button
                          className="btn btn-danger px-2"
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
              </div>
              <Droppable droppableId={column} key={column}>
                {(provided, snapshot) => {
                  return (
                    <div
                      className="Column p-2 shadow"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{
                        minHeight: "300px",
                        background: snapshot.isDraggingOver
                          ? "lightblue"
                          : "#f5efed",
                      }}
                    >
                      {Board[column].map((task, i) => {
                        return (
                          <Draggable
                            draggableId={task._id}
                            index={i}
                            key={task._id}
                          >
                            {(provided) => {
                              return (
                                <div
                                  className="bg-secondary rounded p-1 mb-3"
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  d
                                >
                                  <h5>{task.label}</h5>
                                  <p>{task.description}</p>
                                </div>
                              );
                            }}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  );
                }}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}

export default KanbanBoard;
