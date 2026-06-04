const router = require('express').Router();
const ctrl = require('../controllers/productController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const ah = require('../utils/asyncHandler');
const { product, stockAdjust } = require('../validators/schemas');

router.use(authenticate);
router.get('/', ah(ctrl.list));
router.get('/:id', ah(ctrl.get));
router.post('/', authorize('admin','manager'), validate(product), ah(ctrl.create));
router.put('/:id', authorize('admin','manager'), validate(product), ah(ctrl.update));
router.delete('/:id', authorize('admin'), ah(ctrl.remove));
router.post('/:id/adjust', authorize('admin','manager','staff'), validate(stockAdjust), ah(ctrl.adjustStock));
router.get('/:id/adjustments', ah(ctrl.adjustments));
module.exports = router;
