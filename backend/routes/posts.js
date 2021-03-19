const express = require('express');
const Post = require("../models/post");
const multer = require('multer');

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

    Post.find()
    .then(documents => {
        res.status(200).json(
        {
            message:"Request succeeded",
            posts:documents
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

router.post('', multer({storage:storage}).single('image'),(req, res, next)=>{
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
        title:req.body.title,
        content:req.body.content,
        imagePath:url + '/images/' + req.file.filename
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

router.put('/:id', (req, res, next) => {
    const post = new Post({
        _id:req.params.id,
        title:req.body.title,
        content:req.body.content
    })

    Post.updateOne({_id:req.params.id}, post)
    .then(result => {
        res.status(200).json({message:"Updated!"});
    })
});

router.delete('/:id',(req, res, next)=>{
    
    Post.deleteOne({_id:req.params.id})
    .then(result=>{
        res.status(200).json({message:"Post deleted"});
    });
    
});


module.exports = router;