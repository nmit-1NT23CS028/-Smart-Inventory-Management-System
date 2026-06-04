const router = require('express').Router();
const ctrl = require('../controllers/supplierController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const ah = require('../utils/asyncHandler');
const { supplier } = require('../validators/schemas');

router.use(authenticate);
router.get('/', ah(ctrl.list));
router.post('/', authorize('admin','manager'), validate(supplier), ah(ctrl.create));
router.put('/:id', authorize('admin','manager'), validate(supplier), ah(ctrl.update));
router.delete('/:id', authorize('admin'), ah(ctrl.remove));
module.exports = router;
