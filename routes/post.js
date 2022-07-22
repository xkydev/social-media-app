const { Router } = require('express');
const { check } = require('express-validator');
const { newPost, getPosts, deletePost } = require('../controllers/post');
const { validateFields } = require('../middlewares/validateFields');
const { validateJWT } = require('../middlewares/validateJWT');

const router = Router();

router.use( validateJWT );

router.get('/', getPosts );

router.post('/new', [
    check('content', 'Content is required').not().isEmpty(),
    validateFields
], newPost );

router.delete('/:id', [
    check('id').isMongoId(),
    validateFields
], deletePost );

module.exports = router;