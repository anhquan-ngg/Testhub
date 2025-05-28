import React from 'react';
import {useState} from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Signup from './pages/auth/signup';
import Login from './pages/auth/login';
import { useAppStore } from './store/index';
import { useEffect } from 'react';
import { apiClient } from './lib/api-client';
import { GET_USER_INFO_ROUTE } from './utils/constants';
import ExamTakingPage from './pages/exam/exam-taking-page';

const App = () => {
  const {userInfo, setUserInfo} = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await apiClient.get(GET_USER_INFO_ROUTE, {
          withCredentials: true
        });
        
        console.log('User data response: ', response);
        
        // Fix: check response.data thay vì response.data?.id
        if (response.status === 200 && response.data) {
          console.log('User authenticated: ', response.data)
          setUserInfo(response.data)
        } else {
          setUserInfo(undefined)
        }
      }
      catch (error){
        console.log('Error fetching user data:', error.response?.data || error.message);
        setUserInfo(undefined)
      } finally {
        setLoading(false)
      }
    }

    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false)
    }
  }, [userInfo, setUserInfo]);

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route 
          path="/login" 
          element={userInfo ? <Navigate to="/exams" /> : <Login />} 
        />
        <Route 
          path="/signup" 
          element={userInfo ? <Navigate to="/exams" /> : <Signup />} 
        />

        {/* Exam taking route */}
        <Route 
          path="/exams/:examId" 
          element={userInfo ? <ExamTakingPage /> : <Navigate to="/login" />} 
        />

        {/* Protected routes */}
        <Route
          path="/*"
          element={
            userInfo ? (
                <Routes>
                  <Route path="/exams" element={<Home />} />
                  <Route path="/profile" element={<Home />} />
                  <Route path="/" element={<Navigate to="/exams" />} />
                  <Route path="*" element={<Navigate to="/exams" />} />
                </Routes>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App
