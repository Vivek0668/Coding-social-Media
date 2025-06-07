import { io } from 'socket.io-client';

let socket = null;

export const initSocket = (userId) => {
    if (!userId) {
        console.log("No userId, skipping socket init");
        return null;
    }
    if (socket) {
        console.log("Socket already initialized, reusing for user:", userId);
        return socket;
    }

    const backendUrl = "http://localhost:5000"; // Hardcoded as requested
    console.log("Initializing socket with URL:", backendUrl, "for user:", userId);
    socket = io(backendUrl, {
        query: { userId: userId?.toString() },
        transports: ['websocket'],
        withCredentials: true
    });

    socket.on("connect", () => {
        console.log("Socket connected successfully for user:", userId, "Socket ID:", socket.id, "Connected:", socket.connected);
    });
    socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message);
    });
    socket.on("disconnect", () => {
        console.log("Socket disconnected for user:", userId);
    });

    return socket;
};

export const getSocket = () => {
    if (!socket) {
        console.log("No socket initialized yet");
    }
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        console.log("Socket disconnected");
        socket = null;
    }
};