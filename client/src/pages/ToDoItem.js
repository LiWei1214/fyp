import {FaRegCheckCircle, FaRegTrashAlt, FaRegCircle} from 'react-icons/fa';

const ToDoItem = ({task, toggleComplete, deleteTask}) => {
  const isCompleted = task.status === 'completed';

  return (
    <div className="flex justify-between items-center p-3 bg-white dark:bg-gradient-to-br dark:from-[#2a2a2a] dark:to-[#1f1f1f] rounded-2xl shadow hover:shadow-md mb-3 transition-all">
      <div
        className={`flex items-center cursor-pointer text-base transition-colors ${
          task.completed
            ? 'line-through text-gray-400 dark:text-gray-500'
            : 'text-gray-900 dark:text-gray-100'
        }`}
        onClick={() => toggleComplete(task.id)}>
        {task.completed ? (
          <FaRegCheckCircle className="text-green-500 mr-3" />
        ) : (
          <FaRegCircle className="text-gray-500 dark:text-gray-400 mr-3" />
        )}
        {task.text}
      </div>
      <button
        onClick={() => deleteTask(task.id)}
        className="text-red-500 hover:text-red-700 transition">
        <FaRegTrashAlt />
      </button>
    </div>
  );
};

export default ToDoItem;
