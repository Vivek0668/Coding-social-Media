import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import MessageListItem from './MessageListItem';
import { getSocket } from '../socket';

const MessagesList = () => {
    const [conversations, setConversations] = useState([]);
    const token = useSelector(state => state?.user?.currentUser?.token);
    const userId = useSelector(state => state?.user?.currentUser?._id);
    const socket = getSocket();
    const backendUrl = "http://localhost:5000"; // Hardcoded backend URL

    const getConversation = async () => {
        try {
            const response = await axios.get(
                `${backendUrl}/api/messages/conversations`,
                { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("Fetched conversations:", response.data);
            setConversations(response?.data);
        } catch (err) {
            console.error("Error fetching conversations:", err);
        }
    };

    // Initial fetch
    useEffect(() => {
        if (!token) {
            console.log("No token, skipping conversation fetch");
            return;
        }
        getConversation();
    }, [token]);

    // Socket listener for conversation updates
    useEffect(() => {
        if (!socket || !userId) {
            console.log("Socket or userId missing:", { socketExists: !!socket, userId });
            return;
        }
        console.log("Setting up socket listener for newMessage in MessagesList, user:", userId);

        const handleNewMessage = (message) => {
            console.log("Received new message in MessagesList:", { message, userId });
            setConversations(prev => {
                const updated = [...prev];
                const convoIndex = updated.findIndex(
                    convo => convo._id?.toString() === message.conversationId?.toString()
                );
                if (convoIndex >= 0) {
                    updated[convoIndex] = {
                        ...updated[convoIndex],
                        lastMessage: {
                            text: message.text,
                            senderId: message.senderId,
                            createdAt: message.createdAt,
                            seen: message.senderId?.toString() !== userId?.toString()
                        }
                    };
                    // Sort by lastMessage.createdAt to move recent convo to top
                    updated.sort((a, b) => new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt));
                }
                return updated;
            });
        };

        socket.on("newMessage", handleNewMessage);
        console.log("Socket listener for newMessage set up in MessagesList");

        return () => {
            socket.off("newMessage", handleNewMessage);
            console.log("Socket listener for newMessage removed in MessagesList");
        };
    }, [socket, userId]);

    return (
        <menu className='messageList'>
            <h3>Recent Messages</h3>
            {conversations?.map(convo => (
                <MessageListItem key={convo?._id} conversation={convo} />
            ))}
        </menu>
    );
};

export default MessagesList;