import React, {useEffect, useState} from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Sidebar from './Sidebar';
import TaskPanel from './TaskPanel';
import TaskDetailsPanel from './TaskDetailsPanel';
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from '../services/apiService';

const TodoList = () => {
  const [selectedList, setSelectedList] = useState('Today');
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [lists, setLists] = useState(['Today', 'Personal', 'Work']);
  const [newListName, setNewListName] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const todos = await getTodos();
      setTasks(todos);
    } catch (err) {
      console.error('Error fetching todos:', err);
    }
  };

  const handleToggle = async id => {
    const task = tasks.find(t => t.id === id);
    const updated = {
      ...task,
      status: task.status === 'completed' ? 'pending' : 'completed',
    };
    await updateTodo(id, updated);
    fetchTasks();
  };

  // const handleAddList = () => {
  //   if (newListName && !lists.includes(newListName)) {
  //     setLists([...lists, newListName]);
  //     setNewListName('');
  //   }
  // };
  const handleAddList = listName => {
    // Case-insensitive check for existing lists
    const exists = lists.some(
      list => list.toLowerCase() === listName.toLowerCase(),
    );

    if (!exists && listName.trim()) {
      setLists([...lists, listName.trim()]);
      return true; // Indicate success
    }
    return false; // Indicate failure
  };

  const handleDeleteList = list => {
    if (list === 'Today') return; // Optionally protect default lists
    setLists(lists.filter(l => l !== list));
    setTasks(tasks.filter(task => task.list !== list)); // Remove tasks in that list
    if (selectedList === list) setSelectedList('Today');
  };

  const handleRenameList = (oldName, newName) => {
    setLists(lists.map(l => (l === oldName ? newName : l)));
    setTasks(
      tasks.map(task =>
        task.list === oldName ? {...task, list: newName} : task,
      ),
    );
    if (selectedList === oldName) setSelectedList(newName);
  };

  const handleDelete = async id => {
    await deleteTodo(id);
    setSelectedTask(null);
    fetchTasks();
  };

  const handleAdd = async () => {
    if (!newTaskTitle.trim()) return;

    const newTask = {
      task: newTaskTitle,
      status: 'pending',
      list: selectedList,
    };
    await createTodo(newTask);
    setNewTaskTitle('');
    fetchTasks();
  };

  const filteredTasks = tasks.filter(
    task => task.list === selectedList || !task.list,
  );

  return (
    <DashboardLayout>
      <div className="flex h-screen">
        <Sidebar
          lists={lists} // Use the state variable instead of hardcoded array
          selectedList={selectedList}
          onSelectList={setSelectedList}
          onAddList={handleAddList}
          onRenameList={handleRenameList}
          onDeleteList={handleDeleteList}
        />
        <TaskPanel
          tasks={filteredTasks}
          onToggle={handleToggle}
          selectedList={selectedList}
          onSelectTask={setSelectedTask}
          onAddTask={handleAdd}
        />
        <TaskDetailsPanel
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onDelete={handleDelete}
        />
      </div>
    </DashboardLayout>
  );
};

export default TodoList;
