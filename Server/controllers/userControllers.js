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

//=========== Login user
//Post : api/users/Login
//unprotected

const loginUser = async(req,res,next)=> {
    try {
        const {email,password} = req.body;
        if(!email || !password) {
            return next(new HttpError("Fill in all the fields", 422))

        }
        const lowerCasedEmail = email.toLowerCase();
        const user = await User.findOne({email:lowerCasedEmail})
        if(!user) {
            return next(new HttpError("User does not exists",422))

        }
        const {uPassword, ...userInfo} = user;
        //authentication
        const comparedPassword = await bcrypt.compare(password, user?.password)
        if(!comparedPassword) {
            return next(new HttpError("Incorrect Password !", 422))
        }
        const token = jwt.sign({id : user?._id},process.env.SECRET, {
            expiresIn : "1h"
        })
        res.status(200).json({message : "User logged in successfully !", token : token, id : user?._id, ...userInfo})

    }catch(err) {
        res.status(500).json(err)

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
const editUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { newName, newBio } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return next(new HttpError("User not found", 404));
        }

        // Check if nothing has changed
        if (
            (newName && newName === user.fullName) &&
            (newBio && newBio === user.bio)
        ) {
            return next(new HttpError("No changes detected", 422));
        }

        // Build update object conditionally
        const updateData = {};
        if (newName && newName !== user.fullName) updateData.fullName = newName;
        if (newBio && newBio !== user.bio) updateData.bio = newBio;

        // If updateData is empty, throw error
        if (Object.keys(updateData).length === 0) {
            return next(new HttpError("Nothing to update", 422));
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            message: "UserInfo successfully updated",
            updatedUser
        });

    } catch (err) {
        return next(new HttpError(err.message || "Something went wrong", 500));
    }
};



//==================get users
//Get  : api/users
//protected
const getAllUsers = async(req,res,next)=>{
    try {
        const allUsers =await User.find().limit(10).sort({createdAt : -1})
        if(!allUsers) {
            return next(new HttpError("No users till now", 422));
        }
         res.status(200).json({message : "Users successfully fetched :", allUsers})

    }catch(err) {
        return next(new HttpError(err))

    }

}
//================= get user
//GET : api/users/:id
//protected
const getUser = async(req,res,next)=>{
    try {
        const {id} = req.params;
        const user = await User.findById(id)
        if(!user) {
            return next(new HttpError("User does not exists", 422));
        }else {
            res.status(200).json({message : "User successfully fetched", user : user})
        }

    }catch(err) {
        return next(new HttpError(err))

    }

}

module.exports= {registerUser,loginUser,getUser,getAllUsers,editUser,followUnfollowUser,changeUserAvatar}