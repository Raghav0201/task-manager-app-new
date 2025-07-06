const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { createTask, getTasks, updateTask,deleteTask } = require('../controllers/taskController');
const { shareTask } = require('../controllers/taskController');

router.post('/', protect, createTask);
router.get('/', protect, getTasks);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);
router.post('/share', protect, shareTask);

module.exports = router;
