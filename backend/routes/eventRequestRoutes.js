const express = require("express");
const router = express.Router();

const{
    createEventRequests,
    getAllEventRequests,
    getEventRequestsById,
    updateEventRequests,
    deleteEventRequests,
} = require('../controllers/eventRequestController');

const{authMiddleware,adminOnly} = require('../middleware/auth');

router.post('/', authMiddleware,createEventRequests); //anyone
router.get('/', authMiddleware,adminOnly,getAllEventRequests); //admin
router.get('/:id', authMiddleware,getEventRequestsById); //anyone
router.put('/:id', authMiddleware,adminOnly,updateEventRequests); //admin
router.delete('/:id', authMiddleware,adminOnly,deleteEventRequests); //admin

module.exports = router;

