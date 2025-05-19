import React from 'react';
import {useState} from 'react';
import { BrowserRouter, Navigate, Route, Routes,} from 'react-router-dom';
import Home from './pages/home';
import Signup from './pages/auth/signup';
import Login from './pages/auth/login';
import Exam from './pages/exam/[id]';
import { useAppStore } from './store/index';
import { useEffect } from 'react';
import { apiClient } from './lib/api-client';
import { GET_USER_INFO_ROUTE } from './utils/constants';


const PrivateRoute = ({children}) => {
  const {userInfo} = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth/login"/>
}

const AuthRoute = ({children}) => {
  const {userInfo} = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/exams" /> : children;
}

const App = () => {
  const {userInfo, setUserInfo} = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await apiClient.get(
          GET_USER_INFO_ROUTE,
          {withCredentials: true}
        );
        if (response.status === 200 && response.data.id){
          setUserInfo(response.data)
        } else {
          setUserInfo(undefined)
        }
      } catch (error){
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
    <BrowserRouter>
      <Routes>
        <Route path="/auth">
          <Route path="login" element={<AuthRoute><Login/></AuthRoute>}/>
          <Route path="signup" element={<AuthRoute><Signup/></AuthRoute>}/>
        </Route>
        <Route path="/profile" element={<PrivateRoute><Home/></PrivateRoute>} />        
        <Route path="/exams" element={<PrivateRoute><Home/></PrivateRoute>} />
        <Route path="/exams/:id" element={<PrivateRoute><Exam/></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/auth/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App