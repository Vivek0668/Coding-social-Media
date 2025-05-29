import axios from 'axios'
import React, { useEffect,useState } from 'react'
import { useSelector } from 'react-redux'
import {Link} from 'react-router-dom'
import ProfileImage from './ProfileImage'
import TimeAgo from 'react-timeago'


const Feed = ({post}) => {
    const [creator,setCreator] = useState({});
    const token = useSelector(state=> state.user.currentUser?.token)

 const getCreator = async(post)=> {
    try {
        console.log(post)
     
    const response = await axios.get(`${import.meta.env.VITE_Backend_api_url}/users/${post?.creator}`,
    {withCredentials: true, headers : { Authorization : `Bearer ${token}`}})
    console.log(response.data)
    setCreator(response?.data)
    }catch(err) {
        console.log(err)
    }

 }
 useEffect(()=>{
    getCreator(post);
 },[])


  return (
      <article className='feed'>
    <header className='feed__header'>
        <Link to={`users/${post.creator}`} className='feed__header-profile'>
            <ProfileImage image={creator?.user?.profilePhoto}/>
            <div className='feed__header-details'>
                <h4>{creator?.user?.fullName}</h4>
                <small><TimeAgo date={post?.createdAt}/></small>
            </div>
        </Link>
    </header>

    </article>
  )
}

export default Feed
