import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Await, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import ProfileImage from '../components/ProfileImage';
import TimeAgo from 'react-timeago';
import LikeDislikePost from '../components/LikeDislikePost';
import { FaRegCommentDots } from 'react-icons/fa';
import { IoMdSend, IoMdShare } from 'react-icons/io';
import BookmarksPost from '../components/BookmarksPost';
import PostComment from '../components/PostComment';
const SinglePost = () => {
  const {id} = useParams();
  const [post,setPost] = useState({})
  const user = useSelector(state=> state.user?.currentUser);
  const token = useSelector(state=> state.user?.currentUser?.token);
  const [comments,setComments] = useState([]);
  const[comment,setComment] = useState("");
 const [deleted,setDeleted] = useState(false);
 const[create,setCreate] = useState(false);
const navigate = useNavigate();


 const getPost = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_Backend_api_url}/posts/${id}`,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setPost(response?.data);
    setComments(response?.data?.comments || []);
  } catch (err) {
    console.log(err);
  }
};

  //delete comment
  const deleteComment= async(commentId)=> {
    try {
     const response = await axios.delete(`${import.meta.env.VITE_Backend_api_url}/comments/${commentId}`,
      {withCredentials : true , headers: {Authorization: `Bearer ${token}`}} )

       setComments((prevComments) =>
      prevComments.filter((c) => c._id !== commentId)
   
    ) 
    setCreate(!create);
    setDeleted(!deleted)
  
    }catch(err) {
     console.log(err)
     setCreate(!create)
     setDeleted(!deleted)
    }

  }

  //creatComment
 const creatComment = async () => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_Backend_api_url}/comments/${id}`,
      { comment },
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const newComment = response.data;
    setComments([newComment, ...comments]);
    setComment(""); // Clear input
  } catch (err) {
    console.log(err);
  }
};


  
  useEffect(()=>{
    getPost()

  },[id,deleted,create])


  console.log(post);
  return (
   <section className='singlePost'>
    <header className='feed__header'>
      <ProfileImage image={post?.creator?.profilePhoto}/>
      <div className='feed__header-details'>
        <h4>{post?.creator?.fullName}</h4>
        <small><TimeAgo date={post?.createdAt}/></small>
      </div>
    </header>
    <div className='feed__body'>
      <p>{post?.body}</p>
      <div className='feed__images'>
        <img src={post?.image} alt='image'/>
      </div>
    </div>
    <footer className='feed__footer'>
     <div>
     {post?.likes && <LikeDislikePost post= {post}/> }
     <button className='feed__footer-comments'>
     <FaRegCommentDots/>
    </button>
    <button className='feed__footer-share'>
     <IoMdShare/>
    </button>
     </div>
     <BookmarksPost post={post}/>
    </footer>

    <ul className='singlePost__comments'>
    <form className='singlePost__comments-form' onSubmit={(e) => {
  e.preventDefault();
  creatComment();
}}>
  <textarea 
    value={comment}
    placeholder='Enter your comment...'
    onChange={(e) => setComment(e.target.value)}
  />
  <button type='submit' className='singlePost__comments-btn'><IoMdSend/></button>
</form>
{comments.map(comment => (
  <PostComment key={comment._id} comment={comment} onDeleteComment={deleteComment} />
))}
    </ul>
   </section>
  )
}

export default SinglePost
