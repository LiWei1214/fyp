import React from 'react';

const TaskItem = ({task, onToggle, onClick}) => {
  return (
    <div className="flex items-center gap-3">
      <input
        type="checkbox"
        checked={task.status === 'completed'}
        onChange={() => onToggle(task.id)}
        className="w-5 h-5"
      />
      <span
        onClick={onClick}
        className={`cursor-pointer ${
          task.status === 'completed'
            ? 'line-through text-gray-500'
            : 'text-gray-900 dark:text-gray-100'
        }`}>
        {task.task}
      </span>
    </div>
  );
};

export default TaskItem;
