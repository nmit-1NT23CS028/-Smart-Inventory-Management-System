const router = require('express').Router();
router.use('/auth', require('./auth'));
router.use('/users', require('./users'));
router.use('/products', require('./products'));
router.use('/categories', require('./categories'));
router.use('/suppliers', require('./suppliers'));
router.use('/orders', require('./orders'));
router.use('/dashboard', require('./dashboard'));
module.exports = router;
