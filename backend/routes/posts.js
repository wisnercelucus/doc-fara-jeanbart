const express = require('express');


const checkAuth = require('../middlewares/check-auth');
const extractFile = require('../middlewares/fileMiddleware');

const postController = require('../controllers/postControllers');

const router = express.Router();


//
router.get('', postController.getPosts);

router.get('/:id', postController.getPost);

router.post('', checkAuth, extractFile, postController.createPost);

router.put('/:id', checkAuth, extractFile, postController.updatePost);

router.delete('/:id',checkAuth,postController.deletePost);


module.exports = router;