import React from 'react';
import TaskItem from './TaskItem';

const TaskPanel = ({
  tasks,
  onToggle,
  onSelectTask,
  selectedList,
  onAddTask,
}) => {
  return (
    <div className="p-6 flex-1 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-2">🗓 {selectedList}</h1>
      <button onClick={onAddTask} className="text-[#31473A] mb-4">
        + New Task
      </button>
      <div className="space-y-4">
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggle}
            onClick={() => onSelectTask(task)}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskPanel;
