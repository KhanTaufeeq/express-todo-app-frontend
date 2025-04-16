import "./index.css";
import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTask = () => {
    axios
      .get("http://localhost:5000/api/tasks")
      .then((res) => {
        setTasks(res.data);
        console.log("all tasks", res.data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    console.log(typeof tasks);
    fetchTask();
  }, []);

  const addTask = () => {
    axios
      .post("http://localhost:5000/api/tasks/add", {
        id: tasks.length === 0 ? 1 : tasks[tasks.length - 1].id + 1,
        title: taskTitle,
        description: taskDescription,
        Status: taskStatus,
      })
      .then((res) => {
        fetchTask();
        setTaskTitle("");
        setTaskDescription("");
        setTaskStatus("");
        console.log(res.data);
      })
      .catch((error) => console.log(error));
  };

  const toggleEdit = (task) => {
    setIsEdit(true);
    setEditingTask(task);
  };

  const cancelEdit = () => {
    setIsEdit(false);
  };

  const updateTask = (editingTask) => {
    axios
      .put(`http://localhost:5000/api/tasks/edit/${editingTask.id}`, {
        title: editingTask.title,
        description: editingTask.description,
        Status: editingTask.Status,
      })
      .then((res) => {
        setEditingTask(null);
        setIsEdit(false);
        setTasks(res.data);
        console.log(res.data);
      })
      .catch((error) => console.log(error));
  };

  const deleteTask = (id) => {
    axios
      .delete(`http://localhost:5000/api/tasks/delete/${id}`)
      .then((res) => {
        setTasks(res.data);
        console.log("delete response", res.data);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="font-sans lg:w-1/2 mx-auto border-2 rounded-[10px] bg-black max-w-lg p-6 w-full sm:w-full">
      <h1 className="lg:text-5xl text-gray-500 font-extrabold text-3xl">
        What todo app?...
      </h1>
      <div className="flex gap-4 justify-center flex-col mt-6 mb-15 bg-gray-900 rounded-[10px] p-2">
        <input
          type="text"
          value={taskTitle}
          onChange={(event) => setTaskTitle(event.target.value)}
          placeholder="Enter title here..."
          required
          className="bg-black focus:bg-gray-300 p-2 rounded-[10px] outline-none placeholder:text-gray-400 text-gray-400"
        />
        <input
          type="text"
          value={taskDescription}
          onChange={(event) => setTaskDescription(event.target.value)}
          placeholder="Enter description here..."
          className="bg-black focus:bg-gray-300 p-2 rounded-[10px] outline-none placeholder:text-gray-400 text-gray-400"
        />
        <select
          value={taskStatus}
          onChange={(e) => setTaskStatus(e.target.value)}
          required
          className="bg-black focus:bg-gray-300 p-2 rounded-[10px] outline-none placeholder:text-gray-400 text-gray-400"
        >
          <option value="status">Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>

        <button
          onClick={addTask}
          className="bg-black hover:bg-green-700 text-white font-bold py-2 px-4 rounded-[10px] cursor-pointer"
        >
          Add Task
        </button>
      </div>

      <div>
        {tasks.length ? (
          tasks.map((task) => {
            return (
              <div className="mb-5 bg-gray-900 rounded-[10px] p-2" key={task.id}>
                <div className={`flex items-center justify-between w-full ${task.Status == 'completed' ? 'line-through text-white' : ''}`}>
                  <div>
                    <p className="text-white text-2xl">{task.title}</p>
                    <p className="text-white">{task.description}</p>
                  </div>
                  <p className="text-white">{task.Status}</p>
                </div>
                <div className="flex items-center justify-between w-3xs mt-3">
                  <button
                    onClick={() => toggleEdit(task)}
                    className="bg-black hover:bg-blue-700 text-white font-bold py-1 px-4 rounded cursor-pointer"
                  >
                    Edit Task
                  </button>
                  {isEdit && (
                    <div className="fixed inset-0 bg-gray backdrop-blur-sm flex flex-col items-center justify-center items-center gap-10">
                      <div>
                        <input
                          type="text"
                          onChange={(event) =>
                            setEditingTask({
                              ...editingTask,
                              title: event.target.value,
                            })
                          }
                          value={editingTask.title}
                          className="bg-gray-200 focus:bg-white p-2 rounded border border-gray-400 outline-none"
                        />
                        <br />
                        <br />
                        <input
                          type="text"
                          onChange={(event) =>
                            setEditingTask({
                              ...editingTask,
                              description: event.target.value,
                            })
                          }
                          value={editingTask.description}
                          className="bg-gray-200 focus:bg-white p-2 rounded border border-gray-400 outline-none"
                          required
                        />
                        <br />
                        <br />
                        {/* <input
                          type="input"
                          onChange={(event) =>
                            setEditingTask({
                              ...editingTask,
                              Status: event.target.value,
                            })
                          }
                          value={editingTask.Status}
                          className="bg-gray-200 focus:bg-white p-2 rounded border border-gray-400 outline-none"
                          required
                        /> */}
                        <select
                          onChange={(e) => setEditingTask({...editingTask, Status: e.target.value})}
                          required
                          className="bg-gray-200 focus:bg-white p-2 rounded border border-gray-400 outline-none w-full"
                        >
                          {" "}
                          <option value="status">Status</option>
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                      <div className="flex justify-between">
                        <button
                          type="submit"
                          onClick={() => updateTask(editingTask)}
                          className="bg-black hover:bg-blue-700 text-white font-bold py-1 px-4 rounded cursor-pointer"
                        >
                          Update
                        </button>
                        <button
                          type="button"
                          onClick={() => cancelEdit()}
                          className="bg-black hover:bg-red-700 text-white font-bold py-1 px-4 rounded cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="bg-black hover:bg-red-700 text-white font-bold py-1 px-4 rounded cursor-pointer"
                  >
                    Delete Task
                  </button>
                </div>
                {/* <hr className="border-gray-800 md:border-white mt-2" /> */}
              </div>
            );
          })
        ) : (
          <p className="text-2xl text-white text-center">There is no task yet :(</p>
        )}
      </div>
    </div>
  );
}

export default App;
