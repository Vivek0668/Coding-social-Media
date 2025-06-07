import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { userActions } from "../store/user-slice";
import ProfileImage from '../components/ProfileImage';
import { IoMdSend } from 'react-icons/io';
import MessageItem from '../components/MessageItem';
import { io } from 'socket.io-client';

const Messages = () => {
    const { receiverId } = useParams();
    const [messages, setMessages] = useState([]);
    const [otherMessager, setOtherMessager] = useState({});
    const [messageBody, setMessageBody] = useState("");
    const [conversationId, setConversationId] = useState("");
    const messageEndRef = useRef();
    const token = useSelector(state => state?.user?.currentUser?.token);
    const socket = useSelector(state => state?.user?.socket);
    const userId = useSelector(state => state?.user?.currentUser?._id);
    const dispatch = useDispatch();

    // Initialize socket if not already in Redux
    useEffect(() => {
        if (!userId || socket) {
            console.log("Socket status:", { userId, socketExists: !!socket });
            return;
        }
        console.log("Initializing socket for user:", userId);
        const newSocket = io(`${import.meta.env.VITE_Backend_api_url}`, {
            query: { userId: userId?.toString() },
            transports: ['websocket'],
            withCredentials: true
        });
        newSocket.on("connect", () => {
            console.log("Socket connected successfully for user:", userId, "Socket ID:", newSocket.id);
        });
        newSocket.on("connect_error", (err) => {
            console.error("Socket connection error:", err.message);
        });
        dispatch(userActions.setSocket(newSocket));
        return () => {
            newSocket.disconnect();
            console.log("Socket disconnected for user:", userId);
        };
    }, [userId, socket, dispatch]);

    const getOtherMessager = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_Backend_api_url}/users/${receiverId}`,
                { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("Fetched other messager:", response.data.user);
            setOtherMessager(response.data.user);
        } catch (err) {
            console.error("Error fetching other messager:", err);
        }
    };

    const getMessages = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_Backend_api_url}/messages/${receiverId}`,
                { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
            );
            setMessages(response.data);
            if (response.data.length > 0) {
                setConversationId(response.data[0]?.conversationId);
            }
        } catch (err) {
            console.error("Error fetching messages:", err);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!messageBody.trim()) return;

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_Backend_api_url}/messages/${receiverId}`,
                { newMessage: messageBody },
                { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
            );
            setMessages(prevMessages => [...prevMessages, response?.data]);
            setMessageBody("");

            if (conversationId) {
                const updatedConversation = {
                    _id: conversationId,
                    lastMessage: {
                        text: response.data.text,
                        seen: false,
                        createdAt: response.data.createdAt
                    }
                };
                dispatch(userActions.updateConversation(updatedConversation));
            }
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };

    // Socket effect for new messages
    useEffect(() => {
        if (!socket || !userId) {
            console.log("Socket or userId missing:", { socketExists: !!socket, userId });
            return;
        }

        console.log("Setting up socket listener for newMessage, user:", userId);
        const handleNewMessage = (message) => {
            console.log("Received new message via socket:", { message, currentUser: userId, receiverId });
            if (message?.senderId?.toString() === receiverId?.toString() || 
                message?.receiverId?.toString() === receiverId?.toString()) {
                setMessages(prev => {
                    const exists = prev.some(m => m._id?.toString() === message._id?.toString());
                    if (exists) {
                        console.log("Duplicate message ignored:", message._id);
                        return prev;
                    }
                    console.log("Adding new message to state:", message);
                    return [...prev, message];
                });
                if (message.conversationId?.toString() === conversationId?.toString()) {
                    const updatedConversation = {
                        _id: conversationId,
                        lastMessage: {
                            text: message.text,
                            seen: message.senderId?.toString() !== userId?.toString(),
                            createdAt: message.createdAt
                        }
                    };
                    dispatch(userActions.updateConversation(updatedConversation));
                }
            } else {
                console.log("Message not for this conversation:", { message, receiverId });
            }
        };

        socket.on("newMessage", handleNewMessage);
        console.log("Socket listener for newMessage set up");

        return () => {
            socket.off("newMessage", handleNewMessage);
            console.log("Socket listener for newMessage removed");
        };
    }, [socket, receiverId, conversationId, dispatch, userId]);

    // Fallback: Poll for messages if socket fails
    useEffect(() => {
        const interval = setInterval(() => {
            if (!socket) {
                console.log("No socket, polling for messages");
                getMessages();
            }
        }, 5000); // Poll every 5 seconds if no socket
        return () => clearInterval(interval);
    }, [socket]);

    // Scroll to bottom effect
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Initial data fetch
    useEffect(() => {
        getMessages();
        getOtherMessager();
    }, [receiverId, token]);

    return (
        <section className="messagesBox">
            <header className='messagesBox__header'>
                <ProfileImage image={otherMessager.profilePhoto} />
                <div className='messagesBox__header-info'>
                    <h4>{otherMessager?.fullName}</h4>
                    <small>last seen 2 mins ago</small>
                </div>
            </header>
            <ul className='messagesBox__messages'>
                {messages?.map((message, index) => (
                    <MessageItem key={index} message={message} />
                ))}
                <div ref={messageEndRef}></div>
            </ul>
            <form onSubmit={sendMessage}>
                <input
                    placeholder='Enter Message...'
                    autoFocus
                    type='text'
                    value={messageBody}
                    onChange={({ target }) => setMessageBody(target.value)}
                />
                <button type='submit'><IoMdSend /></button>
            </form>
        </section>
    );
};

export default Messages;