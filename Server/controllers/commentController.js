const HttpError = require('../models/errorModel')
const User = require('../models/userModel')
const Post = require('../models/postModel')
const Comment = require('../models/commentModel')




//================createComment
//Post
//api/comments/:postId
//Protected
const createComment = async(req,res,next)=> {
    try {
     const {postId} = req.params;
     const {comment} = req.body
    if(!comment) {
        return next(new HttpError("Please add a comment!"));
    }
    const commenter = await User.findById(req.user.id);
    const newComment = await Comment.create({
        creator:{creatorId : req.user.id
    ,creatorName : commenter?.fullName, 
    creatorPhoto : commenter?.profilePhoto},
    comment, postId})
    await Post.findByIdAndUpdate(postId, {$push : {comments : newComment?._id}}, {new: true})
    res.json(newComment).status(200)
    }catch(err) {
        return next(new HttpError(err))
    }
}

//================get post comments
//Get 
//api/comments/:postId
//Protected
const getPostComments = async(req,res,next)=> {
    try{
        res.status(200).json("get comment");
    }catch(err) {
        return next(new HttpError(err))
    }
}


//================deleteComment
//Delete
//api/comments/:postId
//Protected
const deleteComment = async(req,res,next)=> {
    try {
        res.status(200).json("Delete comment");
    }catch(err) {
        return next(new HttpError(err))
    }
}

module.exports = {createComment, getPostComments,deleteComment}