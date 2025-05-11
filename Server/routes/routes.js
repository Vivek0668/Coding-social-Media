


const router = require('express').Router()

const {getUser, getAllUsers,loginUser,registerUser,editUser, followUnfollowUser,changeUserAvatar} 
=  require("../controllers/userControllers")
const authMiddleware = require('../middlewares/authMiddleware')

//user routes

router.post("/users/register",registerUser)
router.post("/users/login",loginUser)
router.get("/users", getAllUsers)
router.get("/users/:id", getUser)
router.post("/users/avatar" ,authMiddleware ,changeUserAvatar)
router.patch("/users/:id",authMiddleware, editUser)
router.get("/users/:id/follow-unfollow",authMiddleware ,followUnfollowUser)

module.exports = router;