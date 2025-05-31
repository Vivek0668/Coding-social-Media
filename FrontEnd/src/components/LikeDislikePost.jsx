import React, { useEffect, useState } from 'react'
import {FcLike} from "react-icons/fc"
import {FaRegHeart}from "react-icons/fa"
import { useSelector } from 'react-redux'
import axios from 'axios'

const LikeDislikePost = (props) => {
    const userId = useSelector(state=> state.user?.currentUser?.id)
    const [postLiked,setPostLiked] = useState(props.post?.likes?.includes(userId))
    const [post,setPost] = useState(props.post)
    const token = useSelector(state=> state.user?.currentUser.token)
 
    const handleLikeDislike = async()=> {
        try 
        {
   const response = await axios.get(
            `${import.meta.env.VITE_Backend_api_url}/posts/${post?._id}/likeDislike`, {
                withCredentials:true, headers : {Authorization : `Bearer ${token}`}
            })
            setPost(response.data);

        }catch(err) 
        {
            console.log(err);
        }
     }

     const handleIsLikedDisliked = ()=> {
        if(post.likes?.includes(userId)) {
            setPostLiked(true)
        }else {
            setPostLiked(false);
        }
     }

     useEffect(()=>{
      handleIsLikedDisliked();
     },[post])


  return (
   <button className='feed__footer-comments' onClick={handleLikeDislike}>
   {postLiked ? <FcLike/> : <FaRegHeart/> }
   <small>{post?.likes?.length}</small>
   </button>
  )
}

export default LikeDislikePost
