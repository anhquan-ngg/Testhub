import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Auth from './pages/auth';
import Profile from './pages/profile';
import Exam from './pages/exam';
import Signup from './pages/auth/signup';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth/>}/>
        <Route path="/auth/signup" element={<Signup/>}/>
        <Route path="/auth/profile" element={<Profile/>} />
        <Route path="/exams" element={<Exam/>} />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App