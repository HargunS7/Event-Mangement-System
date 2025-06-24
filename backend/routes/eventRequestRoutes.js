const express = require("express");
const router = express.Router();

const{
    createEventRequests,
    getAllEventRequests,
    getEventRequestsById,
    getMyEventRequests,
    updateEventRequests,
    deleteEventRequests,
} = require('../controllers/eventRequestController');

const{authMiddleware,adminOnly} = require('../middleware/auth');

router.post('/', authMiddleware, createEventRequests);           // anyone
router.get('/', authMiddleware, adminOnly, getAllEventRequests); // admin
router.get('/my-requests', authMiddleware, getMyEventRequests);  // user ← ✅ PUT THIS FIRST
router.get('/:id', authMiddleware, getEventRequestsById);        // anyone
router.put('/:id', authMiddleware, updateEventRequests);         // user/admin
router.delete('/:id', authMiddleware, deleteEventRequests); // admin


module.exports = router;

