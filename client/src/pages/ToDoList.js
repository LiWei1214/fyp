import React, {useEffect, useContext, useState} from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Sidebar from './Sidebar';
import TaskPanel from './TaskPanel';
import TaskDetailsPanel from './TaskDetailsPanel';
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  getLists,
  createList,
  deleteList,
  renameList,
} from '../services/apiService';
import {SearchContext} from '../context/SearchContext';

const TodoList = () => {
  const [selectedListId, setSelectedListId] = useState(null); // Store selected list ID
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [lists, setLists] = useState([]);
  const {searchQuery} = useContext(SearchContext);
  const formatDateToMySQL = date => {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d)) return null;
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 19).replace('T', ' ');
  };

  useEffect(() => {
    fetchTasks();
    fetchLists();
  }, []);

  const fetchTasks = async () => {
    try {
      const todos = await getTodos();
      setTasks(todos);
    } catch (err) {
      console.error('Error fetching todos:', err);
    }
  };

  const fetchLists = async () => {
    try {
      const fetchedLists = await getLists();
      setLists(fetchedLists);
      if (fetchedLists.length > 0) {
        setSelectedListId(fetchedLists[0].id);
      }
    } catch (error) {
      console.error('Error fetching lists:', error);
    }
  };

  const handleToggle = async id => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const updated = {
      ...task,
      is_completed: task.is_completed ? 0 : 1,
      due_date: task.due_date ? formatDateToMySQL(task.due_date) : null,
    };

    try {
      await updateTodo(id, updated);
      fetchTasks();
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleAddList = async listName => {
    const exists = lists.some(
      list => list.name.toLowerCase() === listName.toLowerCase(),
    );

    if (!exists && listName.trim()) {
      try {
        const newList = await createList(listName.trim());
        setLists([...lists, newList]); // Add the new list object
        setSelectedListId(newList.id); // Optionally select the new list
      } catch (error) {
        console.error('Error creating list:', error);
      }
    }
  };

  const handleDeleteList = async listName => {
    const listToDelete = lists.find(list => list.name === listName);
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the list "${listName}"? This will remove all its tasks.`,
    );
    if (!confirmDelete) return;
    try {
      await deleteList(listToDelete.id);
      setLists(lists.filter(l => l.id !== listToDelete.id));
      setTasks(tasks.filter(task => task.list_id !== listToDelete.id));
      if (selectedListId === listToDelete.id) {
        setSelectedListId(null);
      }
      alert('List deleted successfully.');
    } catch (error) {
      console.error('Error deleting list:', error);
      alert('Failed to delete list.');
    }
  };

  const handleRenameList = async (oldName, newName) => {
    const listToRename = lists.find(list => list.name === oldName);
    if (listToRename) {
      try {
        await renameList(listToRename.id, newName.trim());
        setLists(
          lists.map(list =>
            list.id === listToRename.id
              ? {...list, name: newName.trim()}
              : list,
          ),
        );
        alert('List renamed successfully.');
      } catch (error) {
        console.error('Error renaming list:', error);
        alert('Failed to rename list.');
      }
    }
  };

  const handleDelete = async id => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this task?',
    );
    if (!confirmDelete) return;

    try {
      await deleteTodo(id);
      setSelectedTask(null);
      fetchTasks();
      alert('Task deleted successfully.');
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task.');
    }
  };

  const handleAddTask = async newTaskData => {
    if (!selectedListId) return;
    const todoData = {
      title: newTaskData.title,
      description: newTaskData.description,
      due_date: newTaskData.due_date,
      list_id: selectedListId,
    };
    try {
      await createTodo(todoData);
      fetchTasks();
    } catch (error) {
      console.error('Error creating task', error);
    }
  };

  const handleUpdateTask = async updatedTask => {
    console.log('handleUpdateTask received:', updatedTask);

    try {
      await updateTodo(updatedTask.id, {
        title: updatedTask.title,
        description: updatedTask.description,
        is_completed: updatedTask.is_completed,
        due_date: updatedTask.due_date,
      });
      fetchTasks();
      setSelectedTask(updatedTask);
      alert('Task updated successfully.');
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task.');
    }
  };

  const filteredTasks = tasks
    .filter(task => task.list_id === selectedListId)
    .filter(task =>
      `${task.title} ${task.description || ''}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
    );

  return (
    <DashboardLayout>
      <div className="flex h-screen">
        <Sidebar
          lists={lists}
          selectedList={selectedListId}
          onSelectList={setSelectedListId}
          onAddList={handleAddList}
          onRenameList={handleRenameList}
          onDeleteList={handleDeleteList}
        />
        <TaskPanel
          tasks={filteredTasks}
          onToggle={handleToggle}
          selectedList={
            lists.find(list => list.id === selectedListId)?.name || ''
          }
          onSelectTask={setSelectedTask}
          onAddTask={handleAddTask}
        />
        <TaskDetailsPanel
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onDelete={handleDelete}
          onUpdateTask={handleUpdateTask}
        />
      </div>
    </DashboardLayout>
  );
};

export default TodoList;
