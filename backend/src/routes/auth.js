const router = require('express').Router();
const ctrl = require('../controllers/authController');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const ah = require('../utils/asyncHandler');
const { login } = require('../validators/schemas');

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Authenticate and receive JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: OK }
 */
router.post('/login', validate(login), ah(ctrl.login));
router.get('/me', authenticate, ah(ctrl.me));
module.exports = router;
