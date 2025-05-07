import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Home from './routes/index';
import Submit from './routes/submit';
import Admin from './routes/admin';
import Login from './routes/login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthProvider>
        <Home />
      </AuthProvider>
    ),
  },
  {
    path: '/submit',
    element: (
      <AuthProvider>
        <ProtectedRoute>
          <Submit />
        </ProtectedRoute>
      </AuthProvider>
    ),
  },
  {
    path: '/admin',
    element: (
      <AuthProvider>
        <ProtectedRoute>
          <Admin />
        </ProtectedRoute>
      </AuthProvider>
    ),
  },
  {
    path: '/login',
    element: (
      <AuthProvider>
        <Login />
      </AuthProvider>
    ),
  },
]); 