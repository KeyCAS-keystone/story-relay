import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Home from './routes/index';
import Submit from './routes/submit';
import Admin from './routes/admin';
import Login from './routes/login';
import AuthCheck from './components/AuthCheck';

// Create router with routes
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/submit',
    element: <AuthCheck><Submit /></AuthCheck>
  },
  {
    path: '/admin',
    element: <AuthCheck><Admin /></AuthCheck>
  },
  {
    path: '/login',
    element: <Login />
  }
]); 