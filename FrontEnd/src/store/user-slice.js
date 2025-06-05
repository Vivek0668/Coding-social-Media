import {createSlice} from "@reduxjs/toolkit"

const userSlice = createSlice({
    name: "user",
    initialState: {
        currentUser: JSON.parse(localStorage.getItem("currentUser")) || null,
        socket: null,
        onlineUsers: [],
        conversations: [] // Just adding this empty array won't affect existing code
    },
    reducers: {
        changeCurrentUser: (state, action) => {
            state.currentUser = action.payload;
        },
        setSocket: (state, action) => {
            state.socket = action.payload;
        },
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
        // ONLY adding this one new reducer
        updateConversation: (state, action) => {
            // Safest implementation that won't crash:
            if (!state.conversations) state.conversations = []; // Fallback
            const existingIndex = state.conversations.findIndex(
                c => c._id === action.payload._id
            );
            if (existingIndex >= 0) {
                // Only update lastMessage to be extra safe
                state.conversations[existingIndex].lastMessage = action.payload.lastMessage;
            }
            // If not found, don't add it (safer than pushing)
        }
    }
});

export const userActions = userSlice.actions;
export default userSlice;