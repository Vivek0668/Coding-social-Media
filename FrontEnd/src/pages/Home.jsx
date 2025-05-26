import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import CreatePost from '../components/CreatePost';
import axios from "axios";

const Home = () => {
const createPost = async(data) => {
  setError("")
  try {
    const response = axios.post(`${import.meta.env.VITE_Backend_api_url}/posts`, data, {
      withCredentials: true,
      headers : {
        Authorization : `Bearer ${token}`
      }, 
    })

    o
  }catch(err) {
    setError(err.response.data.message)

  }
}




  const [posts,setPosts] = useState([]);
  const [loading,isLoading] = useState(false);
  const[error,setError] = useState("")
  const token = useSelector(state=> state?.user?.currentUser?.token)

  return (
    <section className='mainArea'>
      <CreatePost onCreatePost = {createPost} error={error}></CreatePost>
    </section>   
  )
}

export default Home
