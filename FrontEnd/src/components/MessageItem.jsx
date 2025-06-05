import React from 'react'
import { useSelector } from 'react-redux'

const MessageItem = ({message}) => {
      const userId = useSelector(state=> state?.user?.currentUser._id)
  return (
 <li className={`messagesBox__message ${message?.senderId == userId? "sent" : ""}`}>
    <p>{message?.text}</p>
 </li>
  
  )
}

export default MessageItem