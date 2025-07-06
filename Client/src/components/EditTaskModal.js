import React, { useState, useEffect } from 'react';

const EditTaskModal = ({ isOpen, task, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDueDate(task.dueDate?.substring(0, 10) || '');
      setTodos(task.todos || []);
    }
  }, [task]);

  if (!isOpen) return null;

  const handleTodoChange = (index, value) => {
    const updated = [...todos];
    updated[index] = value;
    setTodos(updated);
  };

  const addTodo = () => {
    setTodos([...todos, '']);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedTask = {
      ...task,
      title,
      dueDate,
      todos,
    };
    onSave(updatedTask);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit Task</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <h4>Steps</h4>
          {todos.map((todo, idx) => (
            <input
              key={idx}
              type="text"
              placeholder={`Step ${idx + 1}`}
              value={todo}
              onChange={(e) => handleTodoChange(idx, e.target.value)}
            />
          ))}

          <button type="button" onClick={addTodo}>+ Add Step</button>
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
