import axios from 'axios';
import React from 'react'
import { useSelector } from 'react-redux';
import { useState,useEffect } from 'react';
import MessageListItem from './MessageListItem';

const MessagesList = () => {
  const [converstions,setConversations]  = useState([]);
  const token = useSelector(state=> state?.user?.currentUser?.token);
  const socket = useSelector(state=> state?.user?.socket); 


  const getConversation = async()=> {
    try {
       const response = await axios(`${import.meta.env.VITE_Backend_api_url}/messages/conversations`, {
      withCredentials : true, headers : {Authorization : `Bearer ${token}`}
    })
   setConversations(response?.data);
    }
    catch(err) {
    console.log(err)
  }
  }

  useEffect(()=> {
    getConversation()
  },[socket])



  return (
   
    <menu className='messageList'>
      <h3>Recent Messages</h3>
      {
        converstions?.map(convo => <MessageListItem key={convo?._id}
           conversation={convo}
        />)
      }
    </menu>
  )
}

export default MessagesList
