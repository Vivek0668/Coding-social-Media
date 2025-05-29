const HttpError = require('../models/errorModel');
const Post = require('../models/postModel');
const User = require('../models/userModel');
const { v4: uuid } = require('uuid');
const cloudinary = require('../utilis/cloudinary');
const fs = require('fs');
const path = require('path');

// Create a Post
const createPost = async (req, res, next) => {
  try {
    const { body } = req.body;
    const image = req.files?.image;

    if (!body || !image) {
      return next(new HttpError("All fields including image are required", 400));
    }

    if (image.size > 500000) {
      return next(new HttpError("File size should not exceed 500KB", 422));
    }

    let fileName = image.name.split(".");
    fileName = `${fileName[0]}-${uuid()}.${fileName.pop()}`;
    const filePath = path.join(__dirname, '..', 'uploads', fileName);

    image.mv(filePath, async (err) => {
      if (err) return next(new HttpError("Failed to upload image", 500));

      const result = await cloudinary.uploader.upload(filePath, {
        resource_type: "image"
      });

      fs.unlinkSync(filePath); // delete local file

      if (!result.secure_url) {
        return next(new HttpError("Failed to upload to cloudinary", 500));
      }

      const newPost = await Post.create({
        creator: req.user.id,
        body,
        image: result.secure_url,
      });

      await User.findByIdAndUpdate(req.user.id, {
        $push: { posts: newPost._id }
      });

      res.status(201).json(newPost);
    });
  } catch (err) {
    next(new HttpError(err.message || "Something went wrong", 500));
  }
};

// Get all posts
const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    next(new HttpError(err.message));
  }
};

// Delete a post
const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post || post.creator.toString() !== req.user.id) {
      return next(new HttpError("Not authorized to delete this post", 403));
    }

    await Post.findByIdAndDelete(id);
    await User.findByIdAndUpdate(post.creator, {
      $pull: { posts: post._id }
    });

    res.status(200).json({ message: `Your post was deleted` });
  } catch (err) {
    next(new HttpError(err.message));
  }
};

// Get single post
const getPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id)
      .populate("creator")
      .populate({ path: "comments", options: { sort: { createdAt: -1 } } });

    if (!post) return next(new HttpError("Post not found", 404));
    res.status(200).json(post);
  } catch (err) {
    next(new HttpError(err.message));
  }
};

// Update a post
const updatePost = async (req, res, next) => {
  try {
    const { body } = req.body;
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post || post.creator.toString() !== req.user.id) {
      return next(new HttpError("Not authorized to update this post", 403));
    }

    const updatedPost = await Post.findByIdAndUpdate(id, { body }, { new: true });
    res.status(200).json(updatedPost);
  } catch (err) {
    next(new HttpError(err.message));
  }
};

// Get following users' posts
const getFollowingPosts = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const posts = await Post.find({ creator: { $in: user.following } }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    next(new HttpError(err.message));
  }
};

// Like or Dislike a post
const likeDislikePosts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) return next(new HttpError("Post not found", 404));

    const alreadyLiked = post.likes.includes(req.user.id);
    const update = alreadyLiked
      ? { $pull: { likes: req.user.id } }
      : { $push: { likes: req.user.id } };

    const updatedPost = await Post.findByIdAndUpdate(id, update, { new: true });
    res.status(200).json(updatedPost);
  } catch (err) {
    next(new HttpError(err.message));
  }
};

// Get posts by specific user
const getUserPosts = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate({
      path: "posts",
      options: { sort: { createdAt: -1 } }
    });

    if (!user) return next(new HttpError("User not found", 404));
    res.status(200).json(user.posts.length ? user.posts : { message: "User has 0 posts" });
  } catch (err) {
    next(new HttpError(err.message));
  }
};

// Bookmark/unbookmark a post
const createBookmark = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user.id);
    const alreadyBookmarked = user.bookmarks.includes(id);

    const update = alreadyBookmarked
      ? { $pull: { bookmarks: id } }
      : { $push: { bookmarks: id } };

    const updatedUser = await User.findByIdAndUpdate(req.user.id, update, { new: true });
    res.status(200).json(updatedUser.bookmarks);
  } catch (err) {
    next(new HttpError(err.message));
  }
};

// Get bookmarked posts
const getUserBookmarks = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "bookmarks",
      options: { sort: { createdAt: -1 } }
    });

    res.status(200).json(user.bookmarks.length ? user.bookmarks : { message: "No bookmarks found" });
  } catch (err) {
    next(new HttpError(err.message));
  }
};

module.exports = {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  getFollowingPosts,
  likeDislikePosts,
  getUserPosts,
  createBookmark,
  getUserBookmarks,
};
