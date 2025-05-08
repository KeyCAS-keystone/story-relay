import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Home from './routes/index';
import Submit from './routes/submit';
import Admin from './routes/admin';
import Login from './routes/login';
import ProtectedRoute from './components/ProtectedRoute';

// Create router with routes
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/submit',
    element: (
      <ProtectedRoute>
        <Submit />
      </ProtectedRoute>
    )
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <Admin />
      </ProtectedRoute>
    )
  },
  {
    path: '/login',
    element: <Login />
  }
]); 