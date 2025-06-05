import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import ProfileImage from './ProfileImage'
import Trimtext from '../helpers/Trimtext'
import TimeAgo from 'react-timeago'

const MessageListItem = ({conversation}) => {
    const onlineUsers = useSelector(state=>state.user?.onlineUsers)
  return (
    <Link to={`/messages/${conversation?.participants[0]?._id}`}  className='messageList__item'>
        <ProfileImage className=
        {onlineUsers.includes(conversation.participants[0]?._id)? "active" : ""} 
        image={conversation?.participants[0]?.profilePhoto}  />
        <div className='messageList_item-details'>
            <h5>{conversation.participants[0]?.fullName}</h5>
            <p><Trimtext item={conversation?.lastMessage?.text} maxLength={16}/></p>
            <small><TimeAgo date={conversation?.createdAt}/></small>
        </div>
    </Link>

  )
}

export default MessageListItem