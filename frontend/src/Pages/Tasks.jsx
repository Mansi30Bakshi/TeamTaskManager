import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Tasks.css';

function Tasks() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [assignedTo, setAssignedTo] = useState('');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  useEffect(() => {
    fetchTasks();
    fetchProject();
    fetchMembers();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5001/api/tasks/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load tasks');
    }
  };

  const fetchProject = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5001/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProject(response.data);
    } catch (err) {
      console.error('project fetch error:', err);
    }
  };

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5001/api/projects/${projectId}/members`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMembers(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5001/api/tasks',
        { title, description, dueDate, priority, projectId, assignedTo },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('Medium');
      setAssignedTo('');
      setShowModal(false);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create task');
    }
  };

  const updateStatus = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5001/api/tasks/${taskId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update task');
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'To Do': return 'status-todo';
      case 'In Progress': return 'status-progress';
      case 'Done': return 'status-done';
      default: return 'status-todo';
    }
  };

  const getPriorityClass = (priority) => {
    switch(priority) {
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return '';
    }
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="tasks-container">
      <button className="back-btn" onClick={() => navigate('/projects')}>
        ← Back to Projects
      </button>
      
      <div className="tasks-header">
        <h1>{project?.name} - Tasks</h1>
        <button className="new-task-btn" onClick={() => setShowModal(true)}>+ New Task</button>
      </div>
      
      {error && <div className="error">{error}</div>}
      
      <table className="task-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Priority</th>
            <th>Due Date</th>
            <th>Assigned To</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id}>
              <td>
                <strong>{task.title}</strong><br />
                <small>{task.description}</small>
              </td>
              <td className={getPriorityClass(task.priority)}>{task.priority}</td>
              <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</td>
              <td>{task.assignedTo?.name}</td>
              <td>
                <span className={getStatusClass(task.status)}>{task.status}</span>
              </td>
              <td>
                <select
                  className="status-select"
                  value={task.status}
                  onChange={(e) => updateStatus(task._id, e.target.value)}
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {tasks.length === 0 && (
        <p className="empty-tasks">No tasks yet. Create one!</p>
      )}
      
      {showModal && (
        <div className="modal tasks-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create New Task</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={createTask}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="form-group">
                <label>Assign To</label>
                <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} required>
                  <option value="">Select member</option>
                  {members.map((member) => (
                    <option key={member._id} value={member.userId._id}>
                      {member.userId?.name} ({member.role})
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit">Create Task</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;