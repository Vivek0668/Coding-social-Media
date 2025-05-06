


const router = require('express').Router()

const {getUser, getAllUsers,loginUser,registerUser,editUser, followUnfollowUser,changeUserAvatar} 
=  require("../controllers/userControllers")

//user routes

router.post("/users/register",registerUser)
router.post("/users/login",loginUser)
router.get("/users", getAllUsers)
router.get("/users/:id", getUser)
router.patch("/users/avatar" ,changeUserAvatar)
router.patch("/users/:id",editUser)
router.get("/users/:id",followUnfollowUser)

module.exports = router;