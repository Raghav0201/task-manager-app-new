// controllers/taskController.js

const Task = require('../models/Task');

// controllers/taskController.js

const createTask = async (req, res) => {
  try {
    const { title, todos, dueDate } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "User not found in request" });
    }

    const task = new Task({
      user: req.user._id,
      title,
      todos,
      dueDate
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error("Task creation failed:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};


const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ Update task status (completed toggle)
const toggleTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.title = req.body.title || task.title;
    task.completed = req.body.completed ?? task.completed;

    await task.save();
    res.status(200).json(task);
  } catch (err) {
    console.error("Task update error:", err.message);
    res.status(500).json({ message: "Failed to update task" });
  }
};


const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.deleteOne(); // ✅ Fixed line

    res.status(200).json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Update task note
// controllers/taskController.js

const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });

    const { title, todos, dueDate } = req.body;
    task.title = title || task.title;
    task.todos = Array.isArray(todos) ? todos : task.todos;
    task.dueDate = dueDate || task.dueDate;

    await task.save();
    res.status(200).json(task);
  } catch (err) {
    console.error("Update Task Error:", err.message);
    res.status(500).json({ message: "Failed to update task" });
  }
};

const nodemailer = require('nodemailer');

const shareTask = async (req, res) => {
  const { taskId, email } = req.body;
  const { name } = req.user;

  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const taskUrl = `http://localhost:3000/task/${taskId}`; // <-- Link to the task page

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: `📌 ${name} invited you to collaborate on a task`,
      html: `
        <p>Hi,</p>
        <p><strong>${name}</strong> invited you to collaborate on a task.</p>
        <p><a href="${taskUrl}" style="background:#007aff;color:white;padding:10px 16px;border-radius:8px;text-decoration:none;">View Task</a></p>
        <p>Or copy this link: <br><code>${taskUrl}</code></p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Invitation sent successfully with link!' });
  } catch (err) {
    console.error('Mail error:', err);
    res.status(500).json({ message: 'Failed to send invitation.' });
  }
};


module.exports = {
  createTask,
  getTasks,
  deleteTask,
  toggleTask,
  updateTask,
  shareTask
};

