const router = require('express').Router();
const ctrl = require('../controllers/categoryController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const ah = require('../utils/asyncHandler');
const { category } = require('../validators/schemas');

router.use(authenticate);
router.get('/', ah(ctrl.list));
router.post('/', authorize('admin','manager'), validate(category), ah(ctrl.create));
router.put('/:id', authorize('admin','manager'), validate(category), ah(ctrl.update));
router.delete('/:id', authorize('admin'), ah(ctrl.remove));
module.exports = router;
