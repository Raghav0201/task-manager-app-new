// components/TaskList.js

import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onDeleted, onToggled, onUpdated }) => {
  return (
    <ul>
      {tasks.map(task => (
        <TaskItem
          key={task._id}
          task={task}
          onDeleted={onDeleted}
          onToggled={onToggled}
          onUpdated={onUpdated} // ✅ pass to TaskItem
        />
      ))}
    </ul>
  );
};

export default TaskList;
