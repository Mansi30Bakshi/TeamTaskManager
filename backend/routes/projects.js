const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');
router.post('/', auth, projectController.createProject);
router.get('/', auth, projectController.getProjects);
router.get('/:projectId', auth, projectController.getProjectById);
router.post('/:projectId/members', auth, projectController.addMember);
router.get('/:projectId/members', auth, projectController.getMembers);

module.exports = router;