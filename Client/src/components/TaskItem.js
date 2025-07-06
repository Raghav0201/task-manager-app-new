import React, { useState } from 'react';
import axios from 'axios';
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaShareAlt } from "react-icons/fa";

const API = process.env.REACT_APP_API_URL;

const TaskItem = ({ task, onDeleted, onToggled, onUpdated }) => {
  const token = localStorage.getItem("token");
  const [showEdit, setShowEdit] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [title, setTitle] = useState(task.title);
  const [todos, setTodos] = useState(task.todos);
  const [dueDate, setDueDate] = useState(task.dueDate?.substring(0, 10) || '');

  const deleteTask = async () => {
    await axios.delete(`${API}/api/tasks/${task._id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    onDeleted(task._id);
  };

  const shareTask = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API}/api/tasks/share`, {
        taskId: task._id,
        email: shareEmail,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Invitation sent successfully!");
      setShareEmail('');
      setShowShare(false);
    } catch (err) {
      console.error("Error sharing task:", err.response?.data || err.message);
      alert("Failed to send Invitation");
    }
  };


  const updateTask = async e => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${API}/api/tasks/${task._id}`,
        { title, todos, dueDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onUpdated(res.data);
      setShowEdit(false);
    } catch (err) {
      alert("Error updating task");
    }
  };

  const handleTodoChange = (index, value) => {
    const updatedTodos = [...todos];
    updatedTodos[index] = value;
    setTodos(updatedTodos);
  };

  const addTodoField = () => {
    setTodos([...todos, '']);
  };

  return (
    <div className="task-card">
      <div className="task-header">
        <h4>{task.title}</h4>
        {/* <ShareTask taskId={task._id} /> */}
        <div className="taskButtons">
          <button onClick={() => setShowEdit(true)}><MdModeEdit /></button>
          <button onClick={deleteTask}><MdDelete /></button>
          <button onClick={() => setShowShare(prev => !prev)}><FaShareAlt /></button>
        </div>
      </div>

      <ul>
        {task.todos.map((todo, idx) => (
          <li key={idx}>{idx + 1}. {todo}</li>
        ))}
      </ul>

      <div className="task-footer">
        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
      </div>

      {/* ✅ Share Form appears only if Share clicked */}
      {showShare && (
        <form onSubmit={shareTask} style={{ marginTop: '10px' }}>
          <input
            type="email"
            placeholder="Collaborator's Email"
            value={shareEmail}
            onChange={(e) => setShareEmail(e.target.value)}
            required
            style={{ padding: '8px', borderRadius: '8px', marginRight: '10px' }}
          />
          <button type="submit">Send</button>
        </form>
      )}

      {/* ✨ Edit Modal */}
      {showEdit && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Task</h3>
            <form onSubmit={updateTask}>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Task Title"
                required
              />
              <h4>Update Steps</h4>
              {todos.map((todo, idx) => (
                <input
                  key={idx}
                  value={todo}
                  onChange={e => handleTodoChange(idx, e.target.value)}
                  placeholder={`Step ${idx + 1}`}
                />
              ))}
              <button type="button" onClick={addTodoField}>+ Add Step</button>

              <h4>Update Due Date</h4>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
              />

              <button type="submit">Save</button>
              <button type="button" onClick={() => setShowEdit(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
