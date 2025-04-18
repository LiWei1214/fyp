import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import {getRecentNotes} from '../services/apiService';

const Home = () => {
  const navigate = useNavigate();

  const ProgressBar = ({progress}) => {
    return (
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className="bg-blue-500 h-full"
          style={{width: `${progress}%`}}></div>
      </div>
    );
  };

  const toggleTask = id => {
    setTasks(
      tasks.map(task =>
        task.id === id ? {...task, completed: !task.completed} : task,
      ),
    );
  };

  const [tasks, setTasks] = useState([
    {id: 1, text: 'Finish homework', completed: false},
    {id: 2, text: 'Read one chapter', completed: false},
    {id: 3, text: 'Read 2 chapters', completed: false},
  ]);

  const completedTasks = tasks.filter(task => task.completed).length;
  const progress = (completedTasks / tasks.length) * 100 || 0;

  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      const recentNotes = await getRecentNotes();
      setNotes(recentNotes);
    };
    fetchNotes();
  }, []);
  // const [notes, setNotes] = useState([
  //   {id: 1, title: 'Math Notes', content: 'Derivatives and Integrals'},
  //   {id: 2, title: 'History Summary', content: 'French Revolution'},
  // ]);

  const [goal, setGoal] = useState('Complete all tasks today');

  return (
    <DashboardLayout>
      <h2 className="text-xl font-semibold mt-4">Home</h2>
      <div className="mt-4 grid grid-cols-1 gap-4">
        {/* Goal Settings */}
        <div className="p-4 bg-white shadow-md rounded-md">
          <h3 className="font-semibold">Goal Settings</h3>
          <p>{goal}</p>
          <ProgressBar progress={progress} />
          <p className="text-sm text-gray-500 mt-2">
            {progress.toFixed(2)}% completed
          </p>
        </div>
        {/* To-Do List */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="p-4 bg-white shadow-md rounded-md">
            <h3 className="font-semibold">To-Do List</h3>
            <ul className="mt-2">
              {tasks.map(task => (
                <li key={task.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="cursor-pointer"
                  />
                  <span
                    className={
                      task.completed ? 'line-through text-gray-400' : ''
                    }>
                    {task.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          {/* p-4 border border-gray-600 rounded-lg cursor-pointer bg-white */}
          {/* Recent Notes */}
          <div className="p-4 bg-white shadow-md rounded-lg cursor-pointer">
            <h3 className="font-semibold">Recent Notes</h3>
            <ul className="mt-2">
              {notes.map(note => (
                <li
                  key={note.id}
                  onClick={() => navigate(`/notes/${note.id}`)} // Navigate to Note Page
                  className="p-3 border-b border-gray-300 rounded-md transition-all duration-300 ease-in-out transform hover:scale-102 hover:bg-indigo-50 hover:shadow-lg">
                  <h4 className="font-medium">{note.title}</h4>
                  <p className="text-sm text-gray-600">{note.content}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;
