import React, { useEffect } from 'react'
import { useState } from 'react';
import  {useSelector}   from "react-redux"
import axios from 'axios'
import Feed from "../components/Feed"
import FeedSkeleton from '../components/FeedSkeleton';
import HeaderInfo from '../components/HeaderInfo';
const Bookmarks = () => {


  const [bookmarks,setBookmarks] = useState([])
  const [isLoading,setIsLoading] = useState(false);
  const token = useSelector(state=> state.user?.currentUser.token);

  //get All user bookmarks
  const getBookmarks = async()=> {
    setIsLoading(true)
    try{
     const response = await axios.get(`${import.meta.env.VITE_Backend_api_url}/users/bookmarks`,{
      withCredentials: true, headers: {Authorization: `Bearer ${token}`}
     })
     console.log(response.data )
     const data = Array.isArray(response.data)? response.data : [];
     setBookmarks(data)

    }catch(err) {
      console.log(err);
    }
    setIsLoading(false)
  }

  useEffect(()=> {
    getBookmarks()
  },[])
  return (
    <section>
    <HeaderInfo text={"Bookmarks"}/>
      {isLoading? <FeedSkeleton/> :
       bookmarks.length < 1 ?<p className='center'>No posts bookmarked</p> :
       bookmarks?.map(bookmark=> <Feed key={bookmark?._id} post={bookmark}/> )}
    </section>
  )
}

export default Bookmarks
