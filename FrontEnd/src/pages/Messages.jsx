import React, { useState, useEffect, useRef } from 'react';



import { useDispatch, useSelector } from 'react-redux';

import { useParams } from 'react-router-dom';

import axios from 'axios';

import { userActions } from "../store/user-slice";

import ProfileImage from '../components/ProfileImage';

import { IoMdSend } from 'react-icons/io';

import MessageItem from '../components/MessageItem';

const Messages = () => {

 const { receiverId } = useParams();

 const [messages, setMessages] = useState([]);

 const [otherMessager, setOtherMessager] = useState({});

 const [messageBody, setMessageBody] = useState("");

 const [conversationId, setConversationId] = useState("");

 const messageEndRef = useRef();

 const token = useSelector(state => state?.user?.currentUser?.token);

 const socket = useSelector(state => state?.user?.socket);

 const conversations = useSelector(state => state.user?.conversations);

 const dispatch = useDispatch();

 const getOtherMessager = async () => {

 try {

  const response = await axios.get(

  `${import.meta.env.VITE_Backend_api_url}/users/${receiverId}`,

  { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }

  );

  console.log(response.data.user)

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

  // Update last message in conversations

  if (conversationId) {

  const updatedConversation = {

   _id: conversationId,

   lastMessage: {

   text: messageBody,

   seen: false,

   createdAt: new Date().toISOString()

   }

  };

  dispatch(userActions.updateConversation(updatedConversation));

  }

 } catch (err) {

  console.error("Error sending message:", err);

 }

 };

 // Socket effect

 useEffect(() => {

 if (!socket) return;

 const handleNewMessage = (message) => {

  if (message.sender === receiverId || message.receiver === receiverId) {

  setMessages(prev => [...prev, message]);

  // Update conversation if this is the active conversation

  if (message.conversationId === conversationId) {

   const updatedConversation = {

   _id: conversationId,

   lastMessage: {

    text: message.text,

    seen: true,

    createdAt: message.createdAt

   }

   };

   dispatch(userActions.updateConversation(updatedConversation));

  }

  }

 };

 socket.on("newMessage", handleNewMessage);

 return () => {

  socket.off("newMessage", handleNewMessage);

 };

 }, [socket, receiverId, conversationId, dispatch]);

 // Scroll to bottom effect

 useEffect(() => {

 messageEndRef.current?.scrollIntoView({ behavior: "smooth" });

 }, [messages]);

 // Initial data fetch

 useEffect(() => {

 getMessages();

 getOtherMessager();

 }, [receiverId]);

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

