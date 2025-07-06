import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const localToken = localStorage.getItem('token');
    if (!localToken) {
      alert('Login required');
      navigate('/');
      return;
    }
    setToken(localToken);

    const fetchTasks = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/tasks', {
          headers: { Authorization: `Bearer ${localToken}` }
        });
        setTasks(res.data);
      } catch (err) {
        console.error('Error loading tasks:', err);
        alert('Error loading tasks');
      }
    };

    fetchTasks();
  }, [navigate]);

  const addTask = newTask => setTasks(prev => [newTask, ...prev]);
  const deleteTask = id => setTasks(prev => prev.filter(t => t._id !== id));
  const toggleTask = updated => setTasks(prev => prev.map(t => t._id === updated._id ? updated : t));
  const updateTask = async (updatedTask) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/tasks/${updatedTask._id}`,
        updatedTask,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Update the task in local state
      setTasks(prev =>
        prev.map(t => (t._id === updatedTask._id ? res.data : t))
      );
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Error updating task.");
    }
  };

  return (
    <div>
      <h2>Welcome, {localStorage.getItem('name')}</h2>
      <TaskForm onTaskAdded={addTask} />
      <TaskList tasks={tasks} onDeleted={deleteTask} onToggled={toggleTask} onUpdated={updateTask} />
    </div>
  );
};

export default Dashboard;
