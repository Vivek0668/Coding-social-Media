const HttpError = require("../models/errorModel")
const Conversation = require("../models/conversationModel")
const Message = require("../models/messageModel");
const { text } = require("express");
const { getReceiverSocketId, io } = require("../socket/socket");



///==================CREATE MESSAGE
//POST : api/messages/:receiverId
//PROTECTED


const createMessage = async(req,res,next)=> {
    try{
        const{receiverId} = req.params;
        const {newMessage} = req.body;
        //check if there's already a convo going 
     let conversation = await Conversation.findOne({participants : {$all : [req.user.id, receiverId]}})
     //if not create new one
     if(!conversation) {
        conversation = await Conversation.create({participants:[req.user.id, receiverId],
            lastMessage : {text : newMessage, senderId : req.user.id}
        })
     }

     //create Message 
     const message = await Message.create({
        conversationId : conversation._id, senderId : req.user.id, text : newMessage
     })
     await conversation.updateOne({lastMessage :{text : newMessage, senderId : req.user.id}})
     const receiverSocketId  = getReceiverSocketId(receiverId)
     if(receiverSocketId){
        io.to(receiverSocketId).emit("newMessage", newMessage)
     }

res.status(200).json(message);


    }catch(err) {
        return next(new HttpError(err))
    }
}

////===============GET MESSAGES
//POST : api/messages/:receiverId
//PROTECTED

const getMessage = async(req,res,next)=> {
    try{
       const {receiverId} = req.params;
       const conversation = await Conversation.findOne({participants: [req.user.id, receiverId]})
       if(!conversation) {
        return next(new HttpError("You have no conversation with this person",404))
       }
       const messages = await Message.find({conversationId : conversation._id}).sort({createdAT: 1})
       res.json(messages).status(200)

    }catch(err) {
        return next(new HttpError(err))
    }
}



///===================GET CONVERSATIONS
//GET api/conversations
//PROTECTED
const  getConversations = async(req,res,next)=> {
    try{
        let conversation =await Conversation.find({participants : req.user.id}).populate({
            path : "participants", select : "fullName profilePhoto"
        }).sort({createdAt : -1})
        
        conversation.forEach((conversation)=> {
            conversation.participants  = conversation.participants.filter(participants=>
                participants._id.toString()!= req.user.id.toString()

             );
        });
        res.json(conversation).status(200)
    }catch(err) {
        return next(new HttpError(err))
    }
}



module.exports = {getMessage, createMessage, getConversations}




