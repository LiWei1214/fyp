import React, {useState} from 'react';
import TaskItem from './TaskItem';

const TaskPanel = ({
  tasks,
  onToggle,
  onSelectTask,
  selectedList,
  onAddTask,
}) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');

  const handleAddTaskSubmit = async () => {
    if (!taskTitle.trim()) return;

    const newTaskData = {
      title: taskTitle,
      description: taskDescription,
      due_date: taskDueDate,
    };

    await onAddTask(newTaskData);

    setTaskTitle('');
    setTaskDescription('');
    setTaskDueDate('');
    setIsFormVisible(false);
  };

  return (
    <div className="p-6 flex-1 overflow-y-auto">
      {/* List Title */}
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        🗓 {selectedList}
      </h1>

      {/* Add New Task Button */}
      {!selectedList ? (
        <div className="text-gray-700 dark:text-gray-300 mb-6 bg-yellow-100 dark:bg-yellow-900 p-4 rounded">
          ⚠️ Please create or select a list before adding a task.
        </div>
      ) : (
        <>
          {/* Add New Task Button */}
          {!isFormVisible && (
            <button
              onClick={() => setIsFormVisible(true)}
              className="text-[#31473A] dark:text-green-300 font-semibold hover:underline mb-6">
              + New Task
            </button>
          )}

          {/* Add Task Form */}
          {isFormVisible && (
            <div className="mb-8 p-4 border rounded-lg bg-gray-50 dark:bg-[#1f1f1f] border-gray-200 dark:border-gray-700 space-y-4">
              <input
                type="text"
                placeholder="Task Title"
                value={taskTitle}
                onChange={e => setTaskTitle(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#3b3a3a] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-700"
              />
              <textarea
                placeholder="Task Description (optional)"
                value={taskDescription}
                onChange={e => setTaskDescription(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#3b3a3a] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-700 resize-none h-24"
              />
              <input
                type="datetime-local"
                value={taskDueDate}
                onChange={e => setTaskDueDate(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#3b3a3a] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-700"
              />

              {/* Form Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsFormVisible(false)}
                  className="px-4 py-2 rounded-lg border border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                  Cancel
                </button>
                <button
                  onClick={handleAddTaskSubmit}
                  className="px-4 py-2 rounded-lg bg-[#31473A] text-white hover:bg-[#25362C] transition-all">
                  Add Task
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Task List */}
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
