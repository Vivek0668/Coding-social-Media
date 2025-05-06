const HttpError = require('../models/errorModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
//==================Register user
//Post  : api/users/signup
//unprotected
const registerUser = async(req,res,next)=>{
    try {
      const {fullName, email, password, confirmPassword} = req.body;
      if(!fullName || !email || !password || !confirmPassword ) {
          return next(new HttpError("Fill in all the fields", 422))
      }
      const lowerEmail = email.toLowerCase();
      const user =await User.findOne({ email : lowerEmail })
      if(user) {
        return next(new HttpError("Mail already in use" ,422))
      }
      if(password != confirmPassword) {
        return next(new HttpError("Passwords do not match", 422))
      }
        if(password.length<6) {
            return next(new HttpError("Password length should be atleast 6 characters,",422))
        }
        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        //adding user to db
        const newUser = await User.create({fullName, email : lowerEmail, password : hashedPassword})
        res.status(200).json({message : "New user successfully created!", user : newUser})

    }catch(err) {
        return next(new HttpError(err))

    }

}

const loginUser = async(req,res,next) => {
    try {
        const {email,password} = req.body;
        if(!email || !password) {
            return next(new HttpError("Fill in all the fields", 422))
        }
        const lowerEmail = email.toLowerCase();

        const user = User.findOne({email : lowerEmail})
        if(!user) {
            return next(new HttpError("Invalid credentials", 422))
        }

        const {uPassword, ...userInfo} = user;
        const comparePass = await bcrypt.compare(password,user?.password);
        if(!comparePass) {
            return next(new HttpError("Invalid credentials", 422))
        }


        const token = await jwt.sign({id: user?._id}, process.env.SECRET, {
            expiresIn : '1h'
        }) 
        res.status(200).json({token : token, id : user?._id, ...userInfo})
    }catch(error) {
        return next(new HttpError(error,error.code))

    }


}


//==================Change userprofile
//Patch  : api/users/avatar
//protected
const changeUserAvatar = async(req,res)=>{
    try {
        res.json("Change UserAvatar ")

    }catch(err) {
        return next(new HttpError(err))

    }

}
//==================followUnfollow  user
//Patch  : api/users/:id/follow-unfollow
//unprotected
const followUnfollowUser = async(req,res)=>{
    try {
        res.json("Follow/unfollow User")

    }catch(err) {
        return next(new HttpError(err))

    }

}
//==================Edit user
//Patdh  : api/users/edit
//protected
const editUser = async(req,res)=>{
    try {
        res.json("Edit User")

    }catch(err) {
        return next(new HttpError(err))

    }

}
//==================get users
//Get  : api/users
//protected
const getAllUsers = async(req,res)=>{
    try {
        res.json("GET ALL users")

    }catch(err) {
        return next(new HttpError(err))

    }

}
//================= get user
//GET : api/users/:id
//protected
const getUser = async(req,res)=>{
    try {
        res.json("Get User")

    }catch(err) {
        return next(new HttpError(err))

    }

}

module.exports= {registerUser,loginUser,getUser,getAllUsers,editUser,followUnfollowUser,changeUserAvatar}