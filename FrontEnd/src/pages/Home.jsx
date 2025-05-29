import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import CreatePost from '../components/CreatePost';
import axios from "axios";
import Feeds from "../components/Feeds"

const Home = () => {


  const [posts,setPosts] = useState([]);
  const [loading,isLoading] = useState(false);
  const[error,setError] = useState("")
  const token = useSelector(state=> state?.user?.currentUser?.token)




  const createPost = async(data) => {
  setError("")
  try {
    const response = await axios.post(`${import.meta.env.VITE_Backend_api_url}/posts`, data, {
      withCredentials: true,
      headers : {
        Authorization : `Bearer ${token}`
      }, 
    })

    const newPost = response?.data;
    setPosts([newPost, ...posts])
  }catch(err) {
    setError(err.response.data.message)

  }
  
}


const getPosts = async()=>{
    isLoading(true);
    try{
      const response = await axios(`${import.meta.env.VITE_Backend_api_url}/posts`, {
        withCredentials:true,
        headers : {
          Authorization : `Bearer ${token}`
        }
      })
      setPosts(response?.data);


    }catch(err) {
      console.log(err)
    }

}

useEffect(()=> {
  getPosts()
},[posts])

// console.log(posts);



  return (
    <section className='mainArea'>
      <CreatePost onCreatePost = {createPost} error={error}></CreatePost>
      <Feeds posts ={posts} setPosts = {setPosts}/>
    </section>   
  )
}

export default Home
