import React from 'react';

const TaskItem = ({task, onToggle, onClick}) => {
  return (
    <div className="group flex items-center justify-between p-3 bg-white dark:bg-gradient-to-br dark:from-[#2a2a2a] dark:to-[#1f1f1f] rounded-2xl shadow hover:shadow-md mb-3 transition-all duration-200">
      {/* Left Side: Checkbox and Title */}
      <div
        className="flex items-center gap-4 flex-1 cursor-pointer"
        onClick={onClick}>
        <input
          type="checkbox"
          checked={task.is_completed}
          onChange={e => {
            e.stopPropagation();
            onToggle(task.id);
          }}
          className="w-5 h-5 accent-green-900"
        />
        <span
          className={`text-base transition-colors duration-200 ${
            task.is_completed
              ? 'line-through text-gray-400 dark:text-gray-500'
              : 'text-gray-900 dark:text-gray-100'
          }`}>
          {task.title}
        </span>
      </div>
    </div>
  );
};

export default TaskItem;
