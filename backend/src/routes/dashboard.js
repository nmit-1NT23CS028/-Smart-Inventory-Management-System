const router = require('express').Router();
const ctrl = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/auth');
const ah = require('../utils/asyncHandler');

router.use(authenticate);
router.get('/overview', ah(ctrl.overview));
module.exports = router;
