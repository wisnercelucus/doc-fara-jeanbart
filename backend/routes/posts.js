const express = require('express');
const multer = require('multer');

const checkAuth = require('../middlewares/check-auth');
const Post = require("../models/post");


const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png':'png',
    'image/jpeg':'jpg',
    'image/jpg':'jpg'
}

const storage = multer.diskStorage({
    destination: (req, file, callback)=>{
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mimetype");
        if(isValid){
            error = null;
        }

        callback(error, 'backend/images');
    },
    filename: (req, file, callback)=>{
        const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        callback(null, name + '-' + Date.now() + '.' + ext);
    }
});


//
router.get('', (req, res, next)=>{
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchPosts = undefined;

    if(pageSize && currentPage){
        postQuery.skip(pageSize * (currentPage -1))
        .limit(pageSize);
    }

    postQuery
    .then(documents => {
        fetchPosts = documents;
        return Post.count();
    })
    .then(count => {
        res.status(200).json(
        {
            message:"Request succeeded",
            posts:fetchPosts,
            maxPost:count
        })
    })
});

router.get('/:id', (req, res, next)=>{
    Post.findById(req.params.id).then(
        post =>{
            if(post){
                res.status(200).json(post);
            }else{
                res.status(404).json({message:"Post not found."})
            }
        }
    )
})

router.post('', checkAuth, multer({storage:storage}).single('image'),(req, res, next)=>{
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
        title:req.body.title,
        content:req.body.content,
        imagePath:url + '/images/' + req.file.filename,
        creator:req.userData.userId
    
    })
    
    post.save()
    .then(result=>{
        res.status(201).json({
            message:"Post added successfuly!",
            post:{...result,
            id:result._id, }
        });
    });
    
});

router.put('/:id', checkAuth, multer({storage:storage}).single('image'), (req, res, next) => {
    let imagePath = req.body.imagePath;
    if(req.file){
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + '/images/' + req.file.filename 
    }
    const post = new Post({
        _id:req.params.id,
        title:req.body.title,
        content:req.body.content,
        imagePath:imagePath
    })

    Post.updateOne({_id:req.params.id, creator:req.userData.userId, creator:req.userData.userId}, post)
    .then(result => {
        if(result.n > 0){
            res.status(200).json({post:post, message:"Updated!"});
        }else{
            res.status(401).json({post:post, message:"Not authorized"});
        }
        
    })
});

router.delete('/:id',checkAuth, (req, res, next)=>{
    
    Post.deleteOne({_id:req.params.id, creator:req.userData.userId})
    .then(result=>{
        if(result.n > 0){
            res.status(200).json({message:"Post deleted"});
        }else{
            res.status(401).json({message:"Not authorized"});
        }
        
    });
    
});


module.exports = router;