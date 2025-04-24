import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Profile from './pages/profile';
import Exam from './pages/exam';
import Signup from './pages/auth/signup';
import Login from './pages/auth/login';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/login" element={<Login/>}/>
        <Route path="/auth/signup" element={<Signup/>}/>
        <Route path="/auth/profile" element={<Profile/>} />        
        <Route path="/exams" element={<Exam/>} />
        <Route path="*" element={<Navigate to="/auth/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App