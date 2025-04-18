import React from 'react';

const TaskDetailsPanel = ({task, onClose, onDelete}) => {
  if (!task) return null;

  return (
    <div className="w-80 p-4 border-l bg-gray-50 dark:bg-gray-800 h-screen">
      <button onClick={onClose} className="text-sm mb-2 text-gray-500">
        ← Back
      </button>
      <h2 className="font-semibold text-xl mb-2">{task.task}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        Status: {task.status}
      </p>
      <button
        onClick={() => onDelete(task.id)}
        className="mt-4 w-full bg-red-500 text-white py-2 rounded">
        Delete
      </button>
    </div>
  );
};

export default TaskDetailsPanel;
