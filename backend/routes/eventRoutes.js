const express = require('express');
const router = express.Router();
const {
  getApprovedEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventControllers');

const { authMiddleware, adminOnly } = require('../middleware/auth');

router.get('/', authMiddleware, getApprovedEvents);
router.post('/', authMiddleware, adminOnly, createEvent);
router.put('/:id', authMiddleware, adminOnly, updateEvent);
router.delete('/:id', authMiddleware, adminOnly, deleteEvent);

module.exports = router;
