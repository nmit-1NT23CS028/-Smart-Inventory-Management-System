const router = require('express').Router();
const ctrl = require('../controllers/orderController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const ah = require('../utils/asyncHandler');
const { order, orderStatus } = require('../validators/schemas');

router.use(authenticate);
router.get('/', ah(ctrl.list));
router.get('/:id', ah(ctrl.get));
router.post('/', authorize('admin','manager','staff'), validate(order), ah(ctrl.create));
router.patch('/:id/status', authorize('admin','manager'), validate(orderStatus), ah(ctrl.updateStatus));
module.exports = router;
