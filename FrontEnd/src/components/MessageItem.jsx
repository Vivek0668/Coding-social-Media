import React from 'react';
import { useSelector } from 'react-redux';

const MessageItem = ({ message }) => {
    const userId = useSelector(state => state?.user?.currentUser?._id);
    const isSent = message?.senderId?.toString() === userId?.toString();
    return (
        <li className={`messagesBox__message ${isSent ? "sent" : "received"}`}>
            <p>{message?.text}</p>
        </li>
    );
};

export default MessageItem;