import React, {useState, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {UserContext} from '../context/UserContext';

const Login = () => {
  const [credentials, setCredentials] = useState({email: '', password: ''});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {setUser} = useContext(UserContext);

  const navigate = useNavigate();

  const handleChange = e => {
    setCredentials({...credentials, [e.target.name]: e.target.value});
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await axios.post(
        'http://localhost:5000/api/login',
        credentials,
      );
      const {token, role} = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      const profileRes = await axios.get('http://localhost:5000/api/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setUser(profileRes.data);

      if (role === 'student') {
        navigate('/home');
      } else if (role === 'lecturer') {
        navigate('/lecturer-dashboard');
      }
    } catch (error) {
      alert(
        'Login failed: ' + (error.response?.data.error || 'Server unreachable'),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#a8edea] to-[#fed6e3] p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-left">
            <label className="block text-gray-600 font-medium">Email</label>
            <input
              type="email"
              name="email"
              className="w-full text-black mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              onChange={handleChange}
              required
            />
          </div>
          <div className="text-left">
            <label className="block text-gray-600 font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="w-full text-black mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700">
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className={`w-full py-2 text-white font-bold rounded-lg transition duration-300 ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
            disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-sm text-gray-600 mt-4">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-500 hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
