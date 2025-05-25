const HttpError = require('../models/errorModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const uuid = require('uuid').v4
const fs = require('fs')
const path = require('path')
const cloudinary = require('../utilis/cloudinary')



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
        const {uPassword, ...userInfo} = user.toObject();
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
const changeUserAvatar = async(req,res,next)=>{
    try {
      if(!req.files.avatar) {
        return next(new HttpError("Please upload an image", 404))
      }
      const {avatar} = req.files;
      //check the file size
      if(avatar.size > 500000) {
        return next(new HttpError("Profile picture too big.Should be less then 5mb"))
      }

      let fileName = avatar.name;
      let SplittedName = fileName.split(".")
      let newFileName= SplittedName[0] + uuid() + "." + SplittedName[SplittedName.length-1]
      avatar.mv(path.join(__dirname, "..", "uploads", newFileName), async(err)=> {
        if(err) {
            return next(new HttpError(err), err.code)  
             }

             //store the image on the cloudinary
             const result = await cloudinary.uploader.upload(path.join(__dirname, '..', "uploads", newFileName), {
                resource_type : "image"
             })
             if(!result.secure_url) {
                return next(new HttpError("Not able to upload image on the cloudinary !", 422))
             }
             const updatedUser = await User.findByIdAndUpdate(req.user.id, {profilePhoto : 
                result?.secure_url},
                 {new : true})
                 res.json(updatedUser).status(200)
      })


    }catch(err) {
        return next(new HttpError(err))

    }

}
//==================followUnfollow  user
//Patch  : api/users/:id/follow-unfollow
//protected
const followUnfollowUser = async(req,res,next)=>{
    try {
        const userToFollow = req.params.id
        if(userToFollow === req.user.id) {
            return next(new HttpError("You cannot follow/unfollow yourself", 422))
        }
        const currentUser =await User.findById(req.user.id);
        const isFollowing = currentUser?.following?.includes(userToFollow);
        if(isFollowing) {
        const udpatedUser = await User.findByIdAndUpdate(userToFollow, {$pop: {followeres: req.user.id}}, {new : true})
        await User.findByIdAndUpdate(req.user.id, {$pop: {following: userToFollow}}, 
            {new : true}
        )
        }else {
            const updatedUser = await User.findByIdAndUpdate(userToFollow, {
                $push: {followeres: req.user.id}
            }, {new : true})
            await User.findByIdAndUpdate(req.user.id, {$push : {following : userToFollow}}, {new : true}) 
            res.json(updatedUser)
        }

    }catch(err) {
        return next(new HttpError(err))

    }

}
//==================Edit user
//Patdh  : api/users/edit
//protected
const editUser = async (req, res, next) => {
  try {
    const {fullName, bio} = req.body;
    const editedUser = await User.findByIdAndUpdate(req.user.id,{fullName,bio},{new: true})
    res.json(editedUser).status(200)
  }catch(err) {}

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