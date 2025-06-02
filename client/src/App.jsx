import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { useAppStore } from './store/index';
import { apiClient } from './lib/api-client';
import { GET_USER_INFO_ROUTE } from './utils/constants';
import { Toaster } from 'react-hot-toast';

// Auth pages
import Login from './pages/auth/login';
import Signup from './pages/auth/signup';

// Student pages
import StudentHome from './pages/student/home';
import StudentProfile from './pages/student/profile';
import ExamTakingPage from './pages/exam/exam-taking-page';

// Admin pages
import AdminDashboard from './pages/admin/dashboard';
import UserManagement from './pages/admin/users';
import ExamManagement from './pages/admin/exams';
import CreateExam from './pages/admin/exams/create';
import EditExam from './pages/admin/exams/edit';

// Common pages
// import Home from './pages/Home';
import NotFound from './pages/error/NotFound';
import Forbidden from './pages/error/Forbidden';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import StudentLayout from './layouts/StudentLayout';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { userInfo } = useAppStore();

  if (!userInfo) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userInfo.role)) {
    return <Navigate to="/forbidden" />;
  }

  return children;
};

const App = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await apiClient.get(GET_USER_INFO_ROUTE, {
          withCredentials: true
        });
        
        if (response.status === 200 && response.data) {
          setUserInfo(response.data);
        } else {
          setUserInfo(undefined);
        }
      } catch (error) {
        console.log('Error fetching user data:', error.response?.data || error.message);
        setUserInfo(undefined);
      } finally {
        setLoading(false);
      }
    };

    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserInfo]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Home route
        <Route path="/" element={<Home />} /> */}

        {/* Auth routes */}
        <Route 
          path="/login" 
          element={userInfo ? <Navigate to="/" /> : <Login />} 
        />
        <Route 
          path="/signup" 
          element={userInfo ? <Navigate to="/" /> : <Signup />} 
        />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="exams" element={<ExamManagement />} />
          <Route path="exams/create" element={<CreateExam />} />
          <Route path="exams/:examId/edit" element={<EditExam />} />
          <Route index element={<Navigate to="/admin/dashboard" />} />
        </Route>

        {/* Student routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route path="exams" element={<StudentHome />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="exams/:examId/take" element={<ExamTakingPage />} />
          <Route index element={<Navigate to="/student/exams" />} />
        </Route>

        {/* Error routes */}
        {/* <Route path="/forbidden" element={<Forbidden />} /> */}
        <Route path="*" element={
          userInfo ?  
          (userInfo.role === 'student' ? <Navigate to="/student/exams" /> : <Navigate to="/admin/dashboard" />)
          : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
