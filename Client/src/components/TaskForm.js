import React, { useState } from 'react';
import axios from 'axios';
import '../styles/TaskForm.css';

const API = process.env.REACT_APP_API_URL;

const TaskForm = ({ onTaskAdded }) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [todos, setTodos] = useState(['']);
  const [dueDate, setDueDate] = useState('');

  const handleTodoChange = (index, value) => {
    const updatedTodos = [...todos];
    updatedTodos[index] = value;
    setTodos(updatedTodos);
  };

  const addTodoField = () => setTodos([...todos, '']);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${API}/api/tasks`,
        { title, todos, dueDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onTaskAdded(res.data);
      setTitle('');
      setTodos(['']);
      setDueDate('');
      setShowModal(false);
    } catch (err) {
      console.error('Add Task Error:', err.response?.data || err.message);
      alert('Error adding task');
    }
  };

  return (
    <div>
      <button className="new-task-button" onClick={() => setShowModal(true)}>Create New Task</button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Create New Task</h3>
            <form onSubmit={handleSubmit}>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Task Name"
                required
              />
              <h4>Tasks To Do:</h4>
              {todos.map((todo, index) => (
                <input
                  key={index}
                  value={todo}
                  onChange={e => handleTodoChange(index, e.target.value)}
                  placeholder={`Step ${index + 1}`}
                  required
                />
              ))}
              <button type="button" onClick={addTodoField}>+ Add Step</button>

              <h4>Due Date:</h4>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                required
              />

              <button type="submit">Create Task</button>
              <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskForm;
