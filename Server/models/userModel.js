const mongoose = require('mongoose')
const {Schema,model} = require('mongoose')

const userSchema = new Schema({
    fullName : {type : String, required : true},
    email : {type : String , required : true},
    password : {type : String, required : true},
    profilePhoto : { type :String , default : "https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg?t=st=1746523117~exp=1746526717~hmac=1283e3114ffa9372f5667191ca99296e2056c74cddb9140617f8b2d88419a5e6&w=826"},
    bio : {type: String , default : "No Bio"},
    followeres : [{type: Schema.Types.ObjectId, ref: "User"}],
    following : [{type : Schema.Types.ObjectId, ref : "User"}],
    bookmarks : [{type : Schema.Types.ObjectId, ref : "Post"}],
    posts : [{type : Schema.Types.ObjectId,ref: "Post"}]

}, {
    timestamps : true
})

module.exports = model("User",userSchema)