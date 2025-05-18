


const router = require('express').Router()

const {getUser, getAllUsers,loginUser,registerUser,editUser, followUnfollowUser,changeUserAvatar} 
=  require("../controllers/userControllers")
const { getFollowingPosts, getPost, getPosts, getUserBookmarks, likeDislikePosts, 
    updatePost, deletePost,getUserPosts,  createBookmark, createCreatePost,
} = require('../controllers/postController')
const authMiddleware = require('../middlewares/authMiddleware')
const { createComment,deleteComment,getPostComments } = require('../controllers/commentController')

//user routes

router.post("/users/register",registerUser)
router.post("/users/login",loginUser)
router.get("/users", authMiddleware, getAllUsers)
router.get("/users/bookmarks",authMiddleware, getUserBookmarks)
router.get("/users/:id", authMiddleware, getUser)
router.post("/users/avatar" ,authMiddleware ,changeUserAvatar)
router.patch("/users/:id",authMiddleware, editUser)
router.get("/users/:id/follow-unfollow",authMiddleware ,followUnfollowUser)
router.get("/users/:id/posts",authMiddleware,getUserPosts)



//post routes
router.post('/posts',authMiddleware, createCreatePost)
router.get('/posts/following',authMiddleware, getFollowingPosts)
router.get('/posts/:id', authMiddleware ,getPost)
router.get('/posts',getPosts)
router.patch('/posts/:id',authMiddleware ,updatePost)
router.delete('/posts/:id',authMiddleware, deletePost)
router.get('/posts/:id/likeDislike',authMiddleware,likeDislikePosts)
router.get('/posts/:id/bookmark',authMiddleware, createBookmark)


//comment routes
router.post('/comments/:postId',authMiddleware, createComment)
router.delete('/comments/:postId',authMiddleware, deleteComment)
router.get('/comments/:postId',authMiddleware, getPostComments)






module.exports = router;