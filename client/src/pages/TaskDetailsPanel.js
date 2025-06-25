import React, {useState, useEffect} from 'react';
import {format} from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {FaRegCalendarAlt} from 'react-icons/fa';

const TaskDetailsPanel = ({task, onClose, onDelete, onUpdateTask}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');
  const [editedDueDate, setEditedDueDate] = useState(null);

  useEffect(() => {
    if (task) {
      setEditedDescription(task.description || '');
      setEditedDueDate(task.due_date ? new Date(task.due_date) : null);
    } else {
      setEditedDescription('');
      setEditedDueDate(null);
    }
  }, [task]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (onUpdateTask) {
      let formattedDueDateForBackend = task?.due_date;

      if (editedDueDate instanceof Date && !isNaN(editedDueDate)) {
        const local = new Date(
          editedDueDate.getTime() - editedDueDate.getTimezoneOffset() * 60000,
        );
        formattedDueDateForBackend = local
          .toISOString()
          .slice(0, 19)
          .replace('T', ' ');
      }

      onUpdateTask({
        ...task,
        description: editedDescription,
        title: task.title,
        due_date: formattedDueDateForBackend,
      });
    }
    setIsEditing(false);
    onClose();
  };

  const handleDescriptionChange = event => {
    setEditedDescription(event.target.value);
  };

  const handleDueDateChange = date => {
    setEditedDueDate(date);
  };

  const handleBackClick = () => {
    if (isEditing) {
      handleSave();
    } else {
      onClose();
    }
  };

  if (!task) return null;

  const formattedDueDateDisplay = task.due_date
    ? format(new Date(task.due_date), 'MMM dd, HH:mm')
    : 'No due date';

  return (
    <div className="w-96 p-8 border-l border-gray-200 dark:border-gray-700 h-screen flex flex-col bg-white dark:bg-[#1f1f1f] text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleBackClick}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm flex items-center gap-2">
          ← <span>Back</span>
        </button>
        {!isEditing && (
          <button
            onClick={handleEditClick}
            className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-semibold">
            Edit
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Title */}
        <h2 className="text-2xl font-bold">{task.title}</h2>

        {/* Description */}
        <div className="flex flex-col">
          <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
            Description
          </h3>
          {isEditing ? (
            <textarea
              value={editedDescription}
              onChange={handleDescriptionChange}
              placeholder="No description provided."
              className="resize-none h-32 p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#3b3a3a] text-gray-700 dark:text-gray-300 text-sm focus:outline-none"
            />
          ) : (
            <div className="resize-none h-32 p-3 rounded-lg border bg-gray-50 dark:bg-[#3b3a3a] text-gray-700 dark:text-gray-300 text-sm focus:outline-none">
              <p>{editedDescription || 'No description provided.'}</p>
            </div>
          )}
        </div>

        {/* Due Date */}
        <div className="flex flex-col">
          <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
            Due Date
          </h3>
          {isEditing ? (
            <div className="flex items-center">
              <DatePicker
                selected={editedDueDate}
                onChange={handleDueDateChange}
                showTimeSelect
                dateFormat="MMM dd, HH:mm"
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#3b3a3a] text-gray-700 dark:text-gray-300 text-sm focus:outline-none w-full"
              />
              <FaRegCalendarAlt className="h-5 w-5 ml-2 text-gray-500" />
            </div>
          ) : (
            <p className="text-base text-gray-700 dark:text-gray-300 flex items-center">
              {formattedDueDateDisplay}
              <FaRegCalendarAlt className="h-5 w-5 ml-2 text-gray-500" />
            </p>
          )}
        </div>

        {/* Status */}
        <div className="flex flex-col">
          <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
            Status
          </h3>
          <p
            className={`text-base font-medium mb-4 ${
              task.is_completed ? 'text-green-500' : 'text-yellow-500'
            }`}>
            {task.is_completed ? 'Completed' : 'Pending'}
          </p>
        </div>

        <div className="flex gap-2">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="flex-1 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-md transition">
              Save
            </button>
          ) : (
            <button
              onClick={() => onDelete(task?.id)}
              className="flex-1 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold shadow-md transition">
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsPanel;
