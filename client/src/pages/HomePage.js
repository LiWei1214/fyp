import React, {useEffect, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {
  FaEdit,
  FaImage,
  FaMoon,
  FaTasks,
  FaChartLine,
  FaShareAlt,
} from 'react-icons/fa';
import {UserContext} from '../context/UserContext';
import AOS from 'aos';
import 'aos/dist/aos.css';

const features = [
  {
    icon: <FaEdit />,
    title: 'Smart Note Editor',
    desc: 'Write structured notes with rich formatting and auto-save.',
  },
  {
    icon: <FaImage />,
    title: 'OCR: Image to Text',
    desc: 'Extract handwritten or printed text instantly from images.',
  },
  {
    icon: <FaMoon />,
    title: 'Dark Mode Toggle',
    desc: 'Switch between light and dark modes to suit your environment.',
  },
  {
    icon: <FaChartLine />,
    title: 'Learning Tracker',
    desc: 'Track your productivity with visualized stats and charts.',
  },
  {
    icon: <FaTasks />,
    title: 'To-Do List',
    desc: 'Stay focused and organized with built-in task management tools.',
  },
  {
    icon: <FaShareAlt />,
    title: 'Lecturer Upload',
    desc: 'Teachers can upload learning materials and assessments.',
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const {user} = useContext(UserContext);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && user) {
      let redirectUrl = '/';
      if (user.role === 'student') {
        redirectUrl = '/home';
      } else if (user.role === 'lecturer') {
        redirectUrl = '/lecturer-dashboard';
      }
      navigate(redirectUrl);
    }
    window.scrollTo(0, 0);
  }, [navigate, user]);
  AOS.init({
    duration: 800,
    once: true,
  });

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white font-sans">
      {/* Hero Section */}
      <section className="relative text-center py-24 px-6 bg-gradient-to-br from-blue-200 via-blue-100 to-blue-300 dark:from-gray-800 dark:to-gray-700 overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight leading-tight animate-fade-in-up">
            nottie ✨
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto animate-fade-in-up delay-150">
            Capture. Organize. Grow. — Your intelligent note space
          </p>
          <a
            href="/register"
            className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition"
            data-aos="fade-up"
            data-aos-delay="100">
            Start Taking Notes →
          </a>
        </div>

        {/* Decorative Blobs */}
        <div className="absolute w-96 h-96 bg-blue-400 bg-opacity-30 rounded-full top-0 left-[-100px] blur-3xl"></div>
        <div className="absolute w-72 h-72 bg-indigo-400 bg-opacity-20 rounded-full bottom-[-80px] right-[-80px] blur-3xl"></div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 animate-fade-in-up">
          Why choose <span className="text-blue-600">nottie?</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition duration-300 border dark:border-gray-700"
              data-aos="fade-up"
              data-aos-delay={i * 100}>
              <div className="text-4xl text-blue-600 dark:text-blue-400 mb-4">
                {f.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-800 text-center py-6 mt-10 border-t dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          © {new Date().getFullYear()} nottie — Built for smarter learning.
        </p>
      </footer>
    </div>
  );
}
