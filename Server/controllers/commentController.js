const HttpError = require('../models/errorModel')
const User = require('../models/userModel')
const Post = require('../models/postModel')
const Comments = require('../models/commentModel')




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
        const {postId} = req.params;
        const postComments = await Post.findById(postId).populate({path : "comments", options :
             {sort : {createdAt : -1}}
        })
        
        if(!postComments ) {
            return next(new HttpError("Post dont exist"))
        }
        res.json({comments : postComments}).status(200);
        
    
    }catch(err) {
        return next(new HttpError(err))
    }
}


//================deleteComment
//Delete
//api/comments/:commentId
//Protected
const deleteComment = async(req,res,next)=> {
    try {
      const {commentId} = req.params;
      const comment = await Comments.findById(commentId);
      if(!comment) {
        res.json({message : "Comment dont exists"})
      }
      const commentCreator =await User.findById(comment?.creator?.creatorId);
      if(commentCreator._id != req.user.id) {
        return next(new HttpError("You are not authorized to this activity! "))
      }
      const deletedComment = await Comments.findByIdAndDelete(commentId);
      await Post.findByIdAndUpdate(deletedComment?.postId, {$pull : {comments : commentId}})
      res.json({deletedComment : deletedComment}).status(200);


    }catch(err) {
        return next(new HttpError(err))
    }
}

module.exports = {createComment, getPostComments,deleteComment}