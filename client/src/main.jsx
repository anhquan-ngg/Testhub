import React from 'react';
import ReactDOM from 'react-dom/client';
import { createRoot } from 'react-dom/client'
import {Toaster} from "./components/ui/sonner.jsx"
import './index.css'
import App from './App.jsx'
import { StrictMode } from 'react'

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster closeButton/>
  </StrictMode>
)
