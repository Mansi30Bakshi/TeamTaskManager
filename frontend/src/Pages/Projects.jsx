import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Projects.css';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberRole, setMemberRole] = useState('Member');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://teamtaskmanager-production-6c07.up.railway.app/api/projects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://teamtaskmanager-production-6c07.up.railway.app/api/projects', 
        { name, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setName('');
      setDescription('');
      setShowModal(false);
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create project');
    }
  };

  const addMember = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`https://teamtaskmanager-production-6c07.up.railway.app/api/projects/${selectedProject._id}/members`,
        { email: memberEmail, role: memberRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMemberEmail('');
      setMemberRole('Member');
      setShowMemberModal(false);
      alert('Member added successfully');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add member');
    }
  };

  const viewMembers = async (project) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://teamtaskmanager-production-6c07.up.railway.app/api/projects/${project._id}/members`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMembers(response.data);
      setSelectedProject(project);
      setShowMemberModal(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load members');
    }
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="projects-container">
      <div className="projects-header">
        <h1>Projects</h1>
        <button className="create-project-btn" onClick={() => setShowModal(true)}>+ New Project</button>
      </div>
      
      {error && <div className="error">{error}</div>}
      
      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project._id} className="project-card">
            <h3>{project.name}</h3>
            <p>{project.description || 'No description'}</p>
            <div className="project-btns">
              <button className="view-tasks-btn" onClick={() => navigate(`/tasks/${project._id}`)}>View Tasks</button>
              <button className="members-btn" onClick={() => viewMembers(project)}>Members</button>
            </div>
          </div>
        ))}
      </div>
      
      {projects.length === 0 && (
        <p className="empty-projects">No projects yet. Create one!</p>
      )}
      
      {/* Create Project Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create New Project</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={createProject}>
              <div className="form-group">
                <label>Project Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
              <button type="submit">Create</button>
            </form>
          </div>
        </div>
      )}
      
      {/* Members Modal */}
      {showMemberModal && selectedProject && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedProject.name} - Members</h3>
              <button className="close-btn" onClick={() => setShowMemberModal(false)}>×</button>
            </div>
            
            <table className="table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Role</th></tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member._id}>
                    <td>{member.userId?.name}</td>
                    <td>{member.userId?.email}</td>
                    <td>{member.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <hr />
            
            <form onSubmit={addMember}>
              <h4>Add New Member</h4>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select value={memberRole} onChange={(e) => setMemberRole(e.target.value)}>
                  <option value="Member">Member</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <button type="submit">Add Member</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Projects;