import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  console.log('dashboard loaded at', new Date().toLocaleTimeString());

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://teamtaskmanager-production-6c07.up.railway.app/api/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboard(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load dashboard');
      console.error('dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-state">Loading dashboard...</div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h2>{dashboard?.totalTasks || 0}</h2>
          <p>Total Tasks</p>
        </div>
        
        <div className="stat-card">
          <h2>{dashboard?.myTasks || 0}</h2>
          <p>My Tasks</p>
        </div>
        
        <div className="stat-card">
          <h2 className="overdue-number">{dashboard?.overdueTasks || 0}</h2>
          <p>Overdue Tasks</p>
        </div>
      </div>
      
      <div className="dashboard-card">
        <h3>Tasks by Status</h3>
        <div className="inner-stats">
          <div className="inner-stat-card">
            <h2 className="todo-number">{dashboard?.tasksByStatus?.['To Do'] || 0}</h2>
            <p>To Do</p>
          </div>
          <div className="inner-stat-card">
            <h2 className="progress-number">{dashboard?.tasksByStatus?.['In Progress'] || 0}</h2>
            <p>In Progress</p>
          </div>
          <div className="inner-stat-card">
            <h2 className="done-number">{dashboard?.tasksByStatus?.['Done'] || 0}</h2>
            <p>Done</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;