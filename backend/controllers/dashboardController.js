const ProjectMember = require('../models/ProjectMember');
const Task = require('../models/Task');

exports.getDashboard = async (req, res) => {
  const members = await ProjectMember.find({ userId: req.userId });
  const projectIds = members.map(m => m.projectId);
  
  const tasks = await Task.find({ projectId: { $in: projectIds } });
  
  const myTasks = tasks.filter(t => t.assignedTo.toString() === req.userId);
  
  const today = new Date();
  const overdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < today && t.status !== 'Done');
  
  const tasksByStatus = {
    'To Do': tasks.filter(t => t.status === 'To Do').length,
    'In Progress': tasks.filter(t => t.status === 'In Progress').length,
    'Done': tasks.filter(t => t.status === 'Done').length
  };
  
  const tasksPerUser = {};
  tasks.forEach(task => {
    const userId = task.assignedTo.toString();
    tasksPerUser[userId] = (tasksPerUser[userId] || 0) + 1;
  });
  
  res.json({
    totalTasks: tasks.length,
    myTasks: myTasks.length,
    overdueTasks: overdue.length,
    tasksByStatus,
    tasksPerUser
  });
};