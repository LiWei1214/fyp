import {FaRegCheckCircle, FaRegTrashAlt, FaRegCircle} from 'react-icons/fa';

const ToDoItem = ({task, toggleComplete, deleteTask}) => {
  return (
    <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-2xl shadow mb-3 transition-all">
      <div
        className={`flex items-center cursor-pointer ${
          task.completed ? 'line-through text-gray-400' : ''
        }`}
        onClick={() => toggleComplete(task.id)}>
        {task.completed ? (
          <FaRegCheckCircle className="text-green-500 mr-3" />
        ) : (
          <FaRegCircle className="text-gray-500 mr-3" />
        )}
        {task.text}
      </div>
      <button
        onClick={() => deleteTask(task.id)}
        className="text-red-500 hover:text-red-700">
        <FaRegTrashAlt />
      </button>
    </div>
  );
};

export default ToDoItem;
