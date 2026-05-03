import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Dashboard from './Pages/Dashboard';
import Projects from './Pages/Projects';
import Tasks from './Pages/Tasks';
import Navbar from './Components/Navbar';
import PrivateRoute from './Components/PrivateRoute';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      {token && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/projects" element={<PrivateRoute><Projects /></PrivateRoute>} />
        <Route path="/tasks/:projectId" element={<PrivateRoute><Tasks /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;