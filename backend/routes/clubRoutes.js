// backend/routes/clubsRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/clubsController');

router.get('/clubs', ctrl.listClubs);
router.get('/clubs/:clubId', auth.authMiddleware, ctrl.getClub);
router.patch('/clubs/:clubId', auth.adminOnly, ctrl.updateClub);

router.get('/clubs/:clubId/president', auth.authMiddleware, ctrl.getClubPresident);
router.put('/clubs/:clubId/president', auth.adminOnly, ctrl.setClubPresident);

module.exports = router;
