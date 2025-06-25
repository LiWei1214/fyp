import {useState, useContext, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import {
  getRecentNotes,
  getTodosWithType,
  updateTodo,
} from '../services/apiService';
import {SearchContext} from '../context/SearchContext';

const Home = () => {
  const navigate = useNavigate();
  const {searchQuery} = useContext(SearchContext);

  const ProgressCircle = ({
    progress,
    label,
    size = 80,
    strokeWidth = 8,
    color = '#3b82f6',
  }) => {
    const radius = size / 2 - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div className="flex flex-col items-center gap-2">
        <svg width={size} height={size} className="flex-shrink-0">
          <circle
            className="text-gray-200"
            strokeWidth={strokeWidth}
            stroke="#e5e7eb"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            className={`text-${color.replace('#', '')}`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            stroke={color}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{transition: 'stroke-dashoffset 0.3s ease-in-out'}}
          />
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            className="text-sm fill-[#4A4A4A] dark:fill-gray-200 font-semibold">
            {Math.round(progress)}%
          </text>
        </svg>
        <p className="text-sm font-medium text-[#6E6E6E] dark:text-gray-400">
          {label}
        </p>
      </div>
    );
  };

  const formatDateToMySQL = date => {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d)) return null;
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 19).replace('T', ' ');
  };
  const [dailyTodos, setDailyTodos] = useState([]);
  const [monthlyTodos, setMonthlyTodos] = useState([]);
  const [notes, setNotes] = useState([]);
  const fetchTodos = async () => {
    try {
      const todos = await getTodosWithType();
      // console.log('Received todos with type:', todos);
      const daily = todos.filter(t => t.type === 'daily');
      const monthly = todos.filter(t => t.type === 'monthly');
      setDailyTodos(daily);
      setMonthlyTodos(monthly);
    } catch (err) {
      console.error('Error fetching todos with type:', err);
    }
  };

  useEffect(() => {
    const fetchNotes = async () => {
      const recentNotes = await getRecentNotes();
      setNotes(recentNotes);
    };

    fetchTodos();
    fetchNotes();
  }, []);

  const handleToggle = async todo => {
    const updatedTodo = {
      ...todo,
      is_completed: todo.is_completed ? 0 : 1,
    };

    // Format due_date if it exists
    if (todo.due_date) {
      updatedTodo.due_date = formatDateToMySQL(todo.due_date);
    }

    try {
      await updateTodo(todo.id, updatedTodo);

      if (todo.type === 'daily') {
        setDailyTodos(prev =>
          prev.map(t => (t.id === todo.id ? updatedTodo : t)),
        );
      } else {
        setMonthlyTodos(prev =>
          prev.map(t => (t.id === todo.id ? updatedTodo : t)),
        );
      }

      fetchTodos();
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const getProgress = list =>
    list.length
      ? (list.filter(t => t.is_completed).length / list.length) * 100
      : 0;

  const filteredNotes = notes.filter(note =>
    `${note.title} ${note.content}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-semibold mt-4 text-[#1C1C1E] dark:text-white">
        Home
      </h2>

      {/* Top Section - Goal and Progress */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 shadow-md rounded-md col-span-1 dark:bg-gradient-to-br dark:from-[#2a2a2a] dark:to-[#1f1f1f]">
          <h3 className="font-semibold mb-2 text-[#1C1C1E] dark:text-white mb-2">
            Progress Overview
          </h3>
          <div className="flex justify-around">
            <ProgressCircle
              progress={getProgress(dailyTodos)}
              label="Daily"
              color="#9fbced"
            />
            <ProgressCircle
              progress={getProgress(monthlyTodos)}
              label="Monthly"
              color="#10b981"
            />
          </div>
        </div>

        {/* To-Do List */}
        <div className="bg-white p-4 shadow-md rounded-md col-span-1 md:col-span-1 dark:bg-gradient-to-br dark:from-[#2a2a2a] dark:to-[#1f1f1f]">
          <h3 className="font-semibold text-[#1C1C1E] mb-2 dark:text-white mb-2">
            Daily To-Do List
          </h3>
          <ul className="space-y-2 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600">
            {dailyTodos.map(task => (
              <li key={task.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!task.is_completed}
                  onChange={() => handleToggle(task)}
                  className=" accent-green-900 cursor-pointer"
                />
                <span
                  className={
                    task.is_completed
                      ? 'line-through text-[#9CA3AF]'
                      : 'text-[#4A4A4A] dark:text-gray-200'
                  }>
                  {task.title}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Monthly To-Do List */}
        <div className="bg-white p-4 shadow-md rounded-md col-span-1 md:col-span-1  dark:bg-gradient-to-br dark:from-[#2a2a2a] dark:to-[#1f1f1f]">
          <h3 className="font-semibold text-[#1C1C1E] dark:text-white mb-2">
            Monthly To-Do List
          </h3>
          <ul className="space-y-2 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600">
            {monthlyTodos.map(task => (
              <li key={task.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!task.is_completed}
                  onChange={() => handleToggle(task)}
                  className="accent-green-900 cursor-pointer"
                />
                <span
                  className={
                    task.is_completed
                      ? 'line-through text-[#9CA3AF]'
                      : 'text-[#4A4A4A] dark:text-gray-200'
                  }>
                  {task.title}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recent Notes */}
      <div className="mt-8 bg-white p-4 shadow-sm hover:shadow-md transition-all rounded-xl dark:bg-gradient-to-br dark:from-[#2a2a2a] dark:to-[#1f1f1f]">
        <h3 className="font-semibold text-[#1C1C1E] dark:text-white">
          Recent Notes
        </h3>
        <ul className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotes.map(note => (
            <li
              key={note.id}
              onClick={() => navigate(`/notes/${note.id}`)}
              className="p-3 border border-[#E0E0E0] rounded-md transition-all hover:bg-indigo-50 hover:shadow-md cursor-pointer dark:hover:bg-gray-700 cursor-pointer">
              <h4 className="font-medium text-[#1C1C1E] dark:text-white">
                {note.title}
              </h4>
              <p className="text-sm text-[#6E6E6E]dark:text-gray-400 line-clamp-2">
                {note.content}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </DashboardLayout>
  );
};

export default Home;
