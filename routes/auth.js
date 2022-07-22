const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validateFields');
const { validateJWT } = require('../middlewares/validateJWT');
const { createUser, loginUser, renewToken } = require('../controllers/auth');

const router = Router();

router.post('/register', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is required').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    validateFields
], createUser );

router.post('/login', [
    check('email', 'Email is required').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    validateFields
], loginUser );

router.get('/renew', validateJWT, renewToken );

module.exports = router;