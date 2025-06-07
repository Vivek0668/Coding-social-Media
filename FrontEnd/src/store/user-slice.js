import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        currentUser: JSON.parse(localStorage.getItem("currentUser")) || null,
        onlineUsers: [],
        conversations: []
    },
    reducers: {
        changeCurrentUser: (state, action) => {
            state.currentUser = action.payload;
        },
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
        updateConversation: (state, action) => {
            if (!state.conversations) state.conversations = [];
            const existingIndex = state.conversations.findIndex(
                c => c._id === action.payload._id
            );
            if (existingIndex >= 0) {
                state.conversations[existingIndex].lastMessage = action.payload.lastMessage;
            }
        }
    }
});

export const userActions = userSlice.actions;
export default userSlice;