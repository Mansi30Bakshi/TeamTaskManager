const Task = require('../models/Task');
const ProjectMember = require('../models/ProjectMember');

exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, projectId, assignedTo } = req.body;
    
    const member = await ProjectMember.findOne({
      projectId,
      userId: req.userId
    });
    
    if (!member) {
      return res.status(403).json({ error: 'You are not a member of this project' });
    }
    
    const task = new Task({
      title,
      description,
      dueDate,
      priority,
      projectId,
      assignedTo,
      createdBy: req.userId
    });
    await task.save();
    
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getTasksByProject = async (req, res) => {
  try {
    const member = await ProjectMember.findOne({
      projectId: req.params.projectId,
      userId: req.userId
    });
    
    if (!member) {
      return res.status(403).json({ error: 'Not a member of this project' });
    }
    
    const tasks = await Task.find({ projectId: req.params.projectId })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');
    
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const member = await ProjectMember.findOne({
      projectId: task.projectId,
      userId: req.userId
    });
    
    const isAdmin = member?.role === 'Admin';
    const isAssigned = task.assignedTo.toString() === req.userId;
    
    if (!isAdmin && !isAssigned) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    const allowedUpdates = isAdmin 
      ? ['title', 'description', 'dueDate', 'priority', 'status', 'assignedTo']
      : ['status'];
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    });
    
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const adminCheck = await ProjectMember.findOne({
      projectId: task.projectId,
      userId: req.userId,
      role: 'Admin'
    });
    
    if (!adminCheck) {
      return res.status(403).json({ error: 'Only admin can delete tasks' });
    }
    
    await task.deleteOne();
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};