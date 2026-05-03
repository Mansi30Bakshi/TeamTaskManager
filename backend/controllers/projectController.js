const Project = require('../models/Project');
const ProjectMember = require('../models/ProjectMember');
const User = require('../models/User');

exports.createProject = async (req, res) => {
  const { name, description } = req.body;
  
  const project = await Project.create({
    name,
    description,
    createdBy: req.userId
  });
  
  await ProjectMember.create({
    projectId: project._id,
    userId: req.userId,
    role: 'Admin'
  });
  
  res.json(project);
};

exports.getProjects = async (req, res) => {
  const members = await ProjectMember.find({ userId: req.userId }).populate('projectId');
  const projects = members.map(m => m.projectId);
  res.json(projects);
};

exports.addMember = async (req, res) => {
  const { projectId } = req.params;
  const { email, role } = req.body;
  
  const adminCheck = await ProjectMember.findOne({
    projectId,
    userId: req.userId,
    role: 'Admin'
  });
  
  if (!adminCheck) {
    return res.status(403).json({ error: 'Only admin can add members' });
  }
  
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const existing = await ProjectMember.findOne({
    projectId,
    userId: user._id
  });
  
  if (existing) {
    return res.status(400).json({ error: 'User already in project' });
  }
  
  const member = await ProjectMember.create({
    projectId,
    userId: user._id,
    role: role || 'Member'
  });
  res.json({ message: 'Member added', member });
};

exports.getMembers = async (req, res) => {
  const members = await ProjectMember.find({ projectId: req.params.projectId })
    .populate('userId', 'name email');
  res.json(members);
};

exports.getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.projectId);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  res.json(project);
};