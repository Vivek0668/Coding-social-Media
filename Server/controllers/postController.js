const HttpError= require('../models/errorModel')
const Post = require('../models/postModel')
const User = require('../models/userModel')

const {v4:uuid} = require('uuid')
const cloudinary = require('../utilis/cloudinary')
const fs = require('fs')
const path  = require('path')


//============= Create post
//POST : api/posts
//PROTECTED

const createCreatePost = async(req,res, next)=> {
        try {
         const {body} = req.body;
         if(!body) {
            return next(new HttpError("Fill all the required fields"))
         }
         if(!req.files.image) {
            return next(new HttpError("Please choose an image"))
         }else {
            const {image} = req.files
            if(image.size>1000000) {
                return next(new HttpError("File size should not exceed more than 500kb",422))
            }
            let fileName = image.name;
            fileName = fileName.split(".");
            fileName = fileName[0] + uuid() + "." + fileName[fileName.length-1]
            await image.mv(path.join(__dirname, '..', 'uploads', fileName),async(err)=> {
                if(err) {
                    return next(new HttpError(err))
                }
                //store the image in cloudinary
                const result  = await cloudinary.uploader.upload(path.join(__dirname, "..", 'uploads',
                    fileName
                ),{resource_type : "image"})
                if(!result.secure_url) {
                    return next(new HttpError("Couldn't upload the image to cloudinary",422 )) 
                }
                //save post to db
                const newPost  = await Post.create(
                    {creator: req.user.id, body, image: result.secure_url} )

                await User.findByIdAndUpdate(newPost?.creator, {$push: {posts: newPost?._id}}, {new: true})
                res.json(newPost)
            })
         }



        }catch(err) {
            return next(new HttpError(err))
        }

}


//============= get all posts   
//GET : api/getposts
//PROTECTED

const getPosts = async(req,res, next)=> {
        try {
     const posts = await Post.find().sort({createdAt : -1})
     res.status(201).json(posts);

        }catch(err) {
            return next(new HttpError(err))
        }

}



//============= DELETE POST
//DELETE : api/posts/:id
//PROTECTED

const deletePost = async(req,res, next)=> {
        try {
         const {id} = req.params;
         const post = await Post.findById(id);
         if(post?.creator != req.user.id){
            return next(new HttpError("You are not authorized to delete this post! ", 403))
         }
         await Post.findByIdAndDelete(id);
         const mongoose = require("mongoose");


        await User.findByIdAndUpdate( post.creator,
        { $pull: { posts: new mongoose.Types.ObjectId(post._id) } }
);

         res.status(200).json({message : `Your ${post.body} has been deleted`})
        }catch(err) {
            return next(new HttpError(err))
        }

}



//============= GET post
//GET : api/posts/:id
//PROTECTED

const getPost = async(req,res, next)=> {
        try {
            const {id} = req.params;
            const post =  await Post.findById(id).populate("creator").populate({path : "comments", options : {sort 
                : {createdAt : -1}
            } })
            res.json(post)
            if(!post) {
                return next(new HttpError("Post does not exists"))
            }
            res.status(201).json(post)
        }catch(err) {
            return next(new HttpError(err))
        }

}



//============= Update post
//PATCH : api/posts/:id
//PROTECTED

const updatePost = async(req,res, next)=> {
        try {
        const newBody = req.body.body;
        const {id} = req.params;
        const post = await Post.findById(id);
        if(post?.creator != req.user.id) {
            return next(new HttpError("You are not authorized to update this post!", 403))
        }
         const newPost =await Post.findByIdAndUpdate(id, {body : newBody}, {
            new : true
         })
         res.status(201).json(newPost)
        }catch(err) {
            return next(new HttpError(err))
        }

}

//============= GET following posts
//GET : api/posts/following
//PROTECTED

const getFollowingPosts = async(req,res, next)=> {
        try {
            const user =await User.findById(req.user.id)
            const posts = await Post.find({creator : {$in : user?.following}})
            res.json(posts);

        }catch(err) {
            return next(new HttpError(err))
        }

}


//===============likeDislikePosts
//Get: api/posts/:id/like
//Protected

const likeDislikePosts = async(req,res,next) => {
    try {
      const {id} = req.params;
      const post = await Post.findById(id);
      const alreadyLiked = post?.likes.includes(req.user.id);
      let updatedPost;
      if(alreadyLiked) {
       updatedPost = await Post.findByIdAndUpdate(id, {$pull : {likes : req.user.id}}, {new : true})

      }else {
       updatedPost = await Post.findByIdAndUpdate(id,{$push : {likes : req.user.id}}, {new : true})
           
     }
      res.status(200).json({updatedPost : updatedPost}) 

    }catch (err) {
        return next(new HttpError(err));    
    }
}

//===============getsomeuserpost
//Get: api/users/:id/posts
//Protected

const getUserPosts = async(req,res,next) => {
    try {
    // const {id} = req.params;
    // const user = await  User.findById(id)
    // if(!user) {
    //     return next(new HttpError("User don't exists"))
    // }
    // const userPosts = await Post.find({creator : id})
    // if(userPosts.length<1) {
    //     res.status(404).json({message : "User has 0 posts"})
    // }
    // res.status(200).json({userPosts})
   
    const userId = req.params.id;
    const posts = await User.findById(userId).populate({path : "posts", options : {sort: {createdAt:-1}}})
    if(posts.posts<1) {
        res.json({message : "User has 0 posts"})
    }
    res.json(posts);

    }catch (err) {
        return next(new HttpError(err));
    }
}


//======= Create bookmark
//POST
//PROTECTED

const createBookmark = async(req,res,next)=> {
    try {
       const {id} = req.params
       const user = await User.findById(req.user.id)
       const alreadyBookMarked = user?.bookmarks?.includes(id);
       let updatedBookMarks;
       if(alreadyBookMarked) {
         updatedBookMarks = await User.findByIdAndUpdate(req.user.id, {$pull : {bookmarks : id}, },{new : true})
       }else {
        updatedBookMarks =await User.findByIdAndUpdate(req.user.id, {$push : {bookmarks : id}, },{new : true})

       }
        res.status(200).json({userBookMarks : updatedBookMarks}); 
       
    }catch (err) {
        return next(new HttpError(err))
    }
}

//====== getBookmarks
//Get  api/users/bookmarks
//Protected

const getUserBookmarks = async(req,res,next) => {
    try {
        const user = await User.findById(req.user.id).populate({path : "bookmarks", options : {sort :{ createdAt : -1}}})
        if(user.bookmarks.length<1) {
            res.json({message : "User has 0 bookmarks"})
        }
        res.json(user)
        
    }catch(err) {
        return next(new HttpError(err))
    }
}

module.exports = {
    getFollowingPosts, getPost, getPosts, getUserBookmarks, likeDislikePosts, 
    updatePost, deletePost,getUserPosts,  createBookmark, createCreatePost,
}