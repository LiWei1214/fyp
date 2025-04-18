import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import LecturerDashboard from './pages/LecturerDashboard';
import Notes from './pages/Note';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Nottie';
import Ok from './pages/Home';
import ProfilePage from './pages/Profile';
import UserProvider from './context/UserContext';
import Todos from './pages/ToDoList';
import CreateNote from './pages/CreateNote';
import NoteEditorPage from './pages/NoteEditorPage';
import {ThemeProvider} from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <Router>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<ProtectedRoute allowedRoles={['student']} />}>
              <Route path="/student-dashboard" element={<StudentDashboard />} />
              <Route path="/home" element={<Ok />} />
              <Route path="/note" element={<Notes />} />
              <Route path="/notes/:id?" element={<NoteEditorPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/todos" element={<Todos />} />
              <Route path="/create-note" element={<CreateNote />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={['lecturer']} />}>
              <Route
                path="/lecturer-dashboard"
                element={<LecturerDashboard />}
              />
            </Route>
          </Routes>
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
