import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Signup from './pages/auth/signup';
import Login from './pages/auth/login';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth">
          <Route path="login" element={<Login/>}/>
          <Route path="signup" element={<Signup/>}/>
        </Route>
        <Route path="/profile" element={<Home/>} />        
        <Route path="/exams" element={<Home/>} />
        <Route path="*" element={<Navigate to="/auth/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App