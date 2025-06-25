import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import LecturerDashboard from './pages/LecturerDashboard';
import Notes from './pages/Note';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import Home from './pages/Home';
import ProfilePage from './pages/Profile';
import UserProvider from './context/UserContext';
import Todos from './pages/ToDoList';
import NoteEditorPage from './pages/NoteEditorPage';
import UploadMaterial from './pages/UploadMaterial';
import EditMaterial from './pages/EditMaterial';
import OnlineResources from './pages/OnlineResources';
import StudentQuiz from './pages/StudentQuiz';
import {ThemeProvider} from './context/ThemeContext';
import {SearchProvider} from './context/SearchContext';

function App() {
  return (
    <SearchProvider>
      <ThemeProvider>
        <UserProvider>
          <Router>
            <Routes>
              <Route
                element={
                  <ProtectedRoute allowedRoles={['student', 'lecturer']} />
                }>
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
              <Route exact path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                <Route path="/home" element={<Home />} />
                <Route path="/note" element={<Notes />} />
                <Route path="/notes/:id?" element={<NoteEditorPage />} />
                <Route path="/todos" element={<Todos />} />
                <Route path="/online-resources" element={<OnlineResources />} />
                <Route
                  path="/student/quiz/:materialId"
                  element={<StudentQuiz />}
                />
              </Route>
              <Route element={<ProtectedRoute allowedRoles={['lecturer']} />}>
                <Route
                  path="/lecturer-dashboard"
                  element={<LecturerDashboard />}
                />
                <Route path="/upload-material" element={<UploadMaterial />} />
                <Route
                  path="/lecturer-dashboard/edit-material/:id"
                  element={<EditMaterial />}
                />
              </Route>
            </Routes>
          </Router>
        </UserProvider>
      </ThemeProvider>
    </SearchProvider>
  );
}

export default App;
