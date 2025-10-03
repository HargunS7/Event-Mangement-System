// backend/routes/clubsRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/clubsController');

router.get('/clubs', ctrl.listClubs);
router.get('/clubs/:clubId', auth, ctrl.getClub);
router.patch('/clubs/:clubId', auth, ctrl.updateClub);

router.get('/clubs/:clubId/president', auth, ctrl.getClubPresident);
router.put('/clubs/:clubId/president', auth, ctrl.setClubPresident);

module.exports = router;
