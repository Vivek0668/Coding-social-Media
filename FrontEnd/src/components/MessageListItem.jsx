import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ProfileImage from './ProfileImage';
import Trimtext from '../helpers/Trimtext';
import TimeAgo from 'react-timeago';

const MessageListItem = ({ conversation }) => {
    const onlineUsers = useSelector(state => state.user?.onlineUsers);
    const userId = useSelector(state => state?.user?.currentUser?._id);

    if (!conversation || !conversation.participants || !conversation.participants.length) {
        console.log("Invalid conversation data:", conversation);
        return null;
    }

    // Find the other participant (not the current user)
    const otherParticipant = conversation.participants.find(
        p => p._id?.toString() !== userId?.toString()
    );

    if (!otherParticipant) {
        console.log("No other participant found in conversation:", conversation);
        return null;
    }

    // Ensure lastMessage.createdAt is a valid date
    const lastMessageDate = conversation?.lastMessage?.createdAt 
        ? new Date(conversation.lastMessage.createdAt)
        : new Date(conversation.createdAt);

    return (
        <Link to={`/messages/${otherParticipant._id}`} className='messageList__item'>
            <ProfileImage
                className={onlineUsers?.includes(otherParticipant._id) ? "active" : ""}
                image={otherParticipant.profilePhoto}
            />
            <div className='messageList_item-details'>
                <h5>{otherParticipant.fullName}</h5>
                <p><Trimtext item={conversation?.lastMessage?.text || "No messages yet"} maxLength={16} /></p>
                <small>
                    <TimeAgo date={lastMessageDate} />
                </small>
            </div>
        </Link>
    );
};

export default MessageListItem;