import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CreatePost from '../components/CreatePost';
import axios from "axios";
import Feeds from "../components/Feeds"

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, isLoading] = useState(false);
  const [error, setError] = useState("");

  const currentUser = useSelector(state => state?.user?.currentUser);
  const token = currentUser?.token;
  const navigate = useNavigate();

  // 🔒 Redirect unauthenticated users
  useEffect(() => {
    if (!token || !currentUser) {
      navigate("/login");
    }
  }, [token, currentUser, navigate]);

  const createPost = async (data) => {
    setError("");
    try {
      const response = await axios.post(`${import.meta.env.VITE_Backend_api_url}/posts`, data, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      const newPost = response?.data;
      setPosts([newPost, ...posts]);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  }

  const getPosts = async () => {
    isLoading(true);
    try {
      const response = await axios(`${import.meta.env.VITE_Backend_api_url}/posts`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPosts(response?.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (token) {
      getPosts();
    }
  }, [token]);

  // 🚫 Prevent rendering if user is not ready
  if (!currentUser || !token) {
    return null; // or a loading spinner
  }

  return (
    <section className='mainArea'>
      <CreatePost onCreatePost={createPost} error={error} />
      <Feeds posts={posts} setPosts={setPosts} />
    </section>
  );
}

export default Home;
