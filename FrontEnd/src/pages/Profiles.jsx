import React, { useEffect, useState } from 'react'
import Userprofile from '../components/Userprofile'
import HeaderInfo from "../components/HeaderInfo"
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useSelector } from 'react-redux'
import Feed from '../components/Feed'
import EditPostModal from '../components/EditPostModal'
import EditProfileModal from '../components/EditProfileModal'

const Profiles = () => {
  const [userPosts,setUserPosts] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  const {id} = useParams();
  const token = useSelector(state=> state.user.currentUser.token)
  const [user,setUser] = useState({})
  const editPostModalIsOpen = useSelector(state=> state.ui.editPostModalIsOpen)
  const editProfileModalIsOpen = useSelector(state=>state.ui.editProfileModalIsOpen)

  const getUser = async()=> {
    try {
      console.log(id)
        const response = await axios.get
    (`${import.meta.env.VITE_Backend_api_url}/users/${id}`,{withCredentials:true
      ,headers: {Authorization:`Bearer ${token}`}
    })
    console.log(response.data.user)
    setUser(response.data.user)
    }catch(err) {
      console.log(err)
    }
  }
  const getUserPosts = async () => {
  setIsLoading(true);
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_Backend_api_url}/users/${id}/posts`,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      }
    );

 
    const postsArray = Array.isArray(response?.data) ? response.data : [];

    setUserPosts(postsArray);
  } catch (err) {
    console.log("Error fetching user posts:", err);
    setUserPosts([]); 
  } finally {
    setIsLoading(false);
  }
};

  const deletePost = async(postId)=> {
    try {
     const response =
      await axios.delete(`${import.meta.env.VITE_Backend_api_url}/posts/${postId}`, {
        withCredentials: true, headers : {Authorization : `Bearer ${token}`}
      })
      console.log(response)
      setUserPosts(userPosts.filter(p=> p?._id!=postId))

    }catch(err) {
      console.log(err)
    }
  }
  
 const updatePost = async(data,postId)=> {
   try {
    const response = await axios.patch
    (`${import.meta.env.VITE_Backend_api_url}/posts/${postId}`,data,{
      withCredentials : true, headers : {Authorization: `Bearer ${token}`}
    })
    const updatedPost = response.data;
    setUserPosts(userPosts.map(post => {
      if(updatedPost._id.toString() == post._id.toString()) {
        post.body = updatedPost?.body
        console.log("updatedPOst :" , updatedPost)
      }
      
      return post;
    }))
 }catch(err) {
  console.log(err);
     
   }
 }

  useEffect(()=>{
    getUser()
    getUserPosts()
  },[])
  
  return (
    <section>
    <Userprofile/>
    <HeaderInfo text={`${user?.fullName}'s posts`}/>
   <section className='profile__posts'>{userPosts?.length<1 ?
   <p className='center'>No Posts by this user</p> : userPosts.map(post=> 
   <Feed key={post._id} post={post} OnDeletePost = {deletePost}/>)
   }</section>
   {editPostModalIsOpen && <EditPostModal  onUpdatePost={updatePost}/>}
   {editProfileModalIsOpen && <EditProfileModal/>}
    </section>
  )
}

export default Profiles
