const http = require("http");
const { Server } = require("socket.io");
const express = require("express");

const app = express();
const server = http.createServer(app);
const allowedOrigins = [
    "https://coding-social-media.vercel.app",
    "https://coding-social-media-vxqo.vercel.app",
    "https://coding-social-media-git-main-vivek-pokharankars-projects.vercel.app",
    /^https:\/\/coding-social-media.*\.vercel\.app$/,
    "http://localhost:5173"
];

const io = new Server(server, {
    cors: {
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.some(o =>
                typeof o === 'string' ? o === origin : o.test(origin)
            )) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
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
    console.log("User attempting connection:", { userId, socketId: socket.id, query: socket.handshake.query });

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

    // Debug connection issues
    socket.on("connect_error", (err) => {
        console.error("Socket connection error from client:", err.message);
    });
});

module.exports = { io, server, app, getReceiverSocketId };