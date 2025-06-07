const http = require("http");
const { Server } = require("socket.io");
const express = require("express");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PATCH", "DELETE"],
        credentials: true
    }
});

const userSocketMap = {}; // userId: socketId

const getReceiverSocketId = (recipientId) => {
    const socketId = userSocketMap[recipientId?.toString()];
    console.log(`Looking up socket ID for user ${recipientId}: ${socketId || 'not found'}`);
    return socketId;
};

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User attempting connection:", { userId, socketId: socket.id });

    if (userId && userId !== "undefined" && userId !== "null" && userId !== "") {
        const userIdStr = userId.toString();
        userSocketMap[userIdStr] = socket.id;
        console.log("User socket map updated:", userSocketMap);
    } else {
        console.log("Invalid userId, connection rejected:", userId);
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("User disconnected:", { userId, socketId: socket.id });
        const userIdStr = userId?.toString();
        if (userIdStr) delete userSocketMap[userIdStr];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

module.exports = { io, server, app, getReceiverSocketId };