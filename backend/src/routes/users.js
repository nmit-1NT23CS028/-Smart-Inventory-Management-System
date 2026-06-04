const router = require('express').Router();
const ctrl = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const ah = require('../utils/asyncHandler');
const { createUser, updateUser } = require('../validators/schemas');

router.use(authenticate);
router.get('/', authorize('admin','manager'), ah(ctrl.list));
router.post('/', authorize('admin'), validate(createUser), ah(ctrl.create));
router.put('/:id', authorize('admin'), validate(updateUser), ah(ctrl.update));
router.delete('/:id', authorize('admin'), ah(ctrl.remove));
router.get('/activity/logs', authorize('admin','manager'), ah(ctrl.activity));
module.exports = router;
