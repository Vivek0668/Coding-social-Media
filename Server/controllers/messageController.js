const HttpError = require("../models/errorModel");
const Conversation = require("../models/conversationModel");
const Message = require("../models/messageModel");
const { getReceiverSocketId, io } = require("../socket/socket");

//==================CREATE MESSAGE
//POST: api/messages/:receiverId
//PROTECTED
const createMessage = async (req, res, next) => {
    try {
        const { receiverId } = req.params;
        const { newMessage } = req.body;

        // Check if conversation exists
        let conversation = await Conversation.findOne({
            participants: { $all: [req.user.id, receiverId] }
        });

        // Create new conversation if not found
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [req.user.id, receiverId],
                lastMessage: { text: newMessage, senderId: req.user.id, createdAt: new Date(), seen: false }
            });
        }

        // Create message
        const message = await Message.create({
            conversationId: conversation._id,
            senderId: req.user.id,
            text: newMessage
        });

        // Update last message
        await Conversation.updateOne(
            { _id: conversation._id },
            { $set: { 
                lastMessage: { 
                    text: newMessage, 
                    senderId: req.user.id, 
                    createdAt: new Date(), 
                    seen: false 
                } 
            } }
        );

        // Emit full message object to both sender and receiver
        const fullMessage = {
            ...message.toObject(),
            senderId: req.user.id.toString(), // Ensure string
            receiverId: receiverId.toString(), // Ensure string
            conversationId: conversation._id
        };
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", fullMessage);
            console.log("Emitted newMessage to receiver:", { receiverId, receiverSocketId, message: fullMessage });
        } else {
            console.log("No socket ID found for receiver:", receiverId);
        }
        const senderSocketId = getReceiverSocketId(req.user.id);
        if (senderSocketId) {
            io.to(senderSocketId).emit("newMessage", fullMessage);
            console.log("Emitted newMessage to sender:", { senderId: req.user.id, senderSocketId, message: fullMessage });
        } else {
            console.log("No socket ID found for sender:", req.user.id);
        }

        res.status(200).json(fullMessage);
    } catch (err) {
        console.error("Error in createMessage:", err);
        return next(new HttpError(err));
    }
};
//===============GET MESSAGES
//POST: api/messages/:receiverId
//PROTECTED
const getMessage = async (req, res, next) => {
    try {
        const { receiverId } = req.params;

        const conversation = await Conversation.findOne({
            participants: { $all: [req.user.id, receiverId] }
        });

        if (!conversation) {
            return next(new HttpError("You have no conversation with this person", 404));
        }

        const messages = await Message.find({ conversationId: conversation._id })
                                      .sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (err) {
        return next(new HttpError(err));
    }
};

//===================GET CONVERSATIONS
//GET: api/conversations
//PROTECTED
const getConversations = async (req, res, next) => {
    try {
        let conversation = await Conversation.find({ participants: req.user.id }).populate({
            path: "participants",
            select: "fullName profilePhoto"
        }).sort({ createdAt: -1 });
        
        conversation.forEach((conversation) => {
            conversation.participants = conversation.participants.filter(participant =>
                participant._id.toString() != req.user.id.toString()
            );
        });
        res.status(200).json(conversation);
    } catch (err) {
        return next(new HttpError(err));
    }
};

module.exports = { getMessage, createMessage, getConversations };