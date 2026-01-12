import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";

const API_URL = "http://127.0.0.1/cybex_laravel/public/api";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URL + '/LoadAllTask');
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async () => {
    if (!title) return alert("Please enter a task title");
    try {
      const res = await axios.post(API_URL + '/AddNewTask', {
        title,
        description,
        completed: false,
      });
      setTasks([res.data, ...tasks]); // Add new task to top
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const toggleComplete = async (task) => {
    try {
      const res = await axios.put(`${API_URL}/UpdateTask/${task.id}`, {
        ...task,
        completed: !task.completed,
      });
      setTasks(tasks.map((t) => (t.id === task.id ? res.data : t)));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/DeleteTask/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="background-gradient">
      <div className="glass-container">
        <header className="header">
          <h1>My Tasks</h1>
          <p>Stay focused, stay productive</p>
        </header>

        {/* Input Section */}
        <div className="input-group">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="modern-input"
          />
          <input
            type="text"
            placeholder="Add a description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="modern-input"
          />
          <button onClick={addTask} className="add-btn">
            + Add Task
          </button>
        </div>

        {/* Task List */}
        <div className="task-list">
          {tasks.length === 0 ? (
            <div className="empty-state">No tasks yet. Relax! ☕</div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`task-card ${task.completed ? "completed" : ""}`}
              >
                <div className="task-content">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleComplete(task)}
                    />
                    <span className="checkmark"></span>
                  </label>
                  <div className="text-container">
                    <h3 className="task-title">{task.title}</h3>
                    {task.description && <p className="task-desc">{task.description}</p>}
                  </div>
                </div>
                <button onClick={() => deleteTask(task.id)} className="delete-btn">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}