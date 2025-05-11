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
            res.json("Create post")

        }catch(err) {
            return next(new HttpError(err))
        }

}


//============= get all posts   
//GET : api/getposts
//PROTECTED

const getPosts = async(req,res, next)=> {
        try {
            res.json("get posts")

        }catch(err) {
            return next(new HttpError(err))
        }

}



//============= DELETE POST
//DELETE : api/deletePost
//PROTECTED

const deletePost = async(req,res, next)=> {
        try {
            res.json("Delete post")

        }catch(err) {
            return next(new HttpError(err))
        }

}



//============= GET post
//GET : api/posts/:id
//PROTECTED

const getPost = async(req,res, next)=> {
        try {
            res.json("Get post")

        }catch(err) {
            return next(new HttpError(err))
        }

}



//============= Update post
//PATCH : api/posts/:id
//PROTECTED

const updatePost = async(req,res, next)=> {
        try {
            res.json("Edit post")

        }catch(err) {
            return next(new HttpError(err))
        }

}

//============= GET following posts
//GET : api/posts/following
//PROTECTED

const getFollowingPosts = async(req,res, next)=> {
        try {
            res.json("Get Following posts")

        }catch(err) {
            return next(new HttpError(err))
        }

}


//===============likeDislikePosts
//Get: api/posts/:id/like
//Protected

const likeDislikePosts = (req,res,next) => {
    try {
        res.json("likeDislikePosts")

    }catch (err) {
        return next(new HttpError(err));
    }
}

//===============getsomeuserpost
//Get: api/users/:id/posts
//Protected

const getUserPosts = (req,res,next) => {
    try {
        res.json("get  User Posts")

    }catch (err) {
        return next(new HttpError(err));
    }
}


//======= Create bookmark
//POST
//PROTECTED

const createBookmark = (req,res,next)=> {
    try {
        res.json("Create bookmark")
    }catch (err) {
        return next(new HttpError(err))
    }
}

//====== getBookmarks
//Get
//Protected

const getBookmarks = (req,res,next) => {
    try {
        res.json("Get bookmarks")
    }catch(err) {
        return next(new HttpError(err))
    }
}