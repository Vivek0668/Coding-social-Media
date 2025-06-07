import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CiSearch } from 'react-icons/ci'
import { useSelector } from 'react-redux'
import ProfileImage from './ProfileImage'
import axios from 'axios'

const Navbar = () => {
  const navigate = useNavigate();

  const currentUser = useSelector(state => state?.user?.currentUser);
  const userId = currentUser?.id;
  const token = currentUser?.token;

  const [profilePhoto, setProfilePhoto] = useState(currentUser?.profilePhoto || "");
  
  if(profilePhoto== null || profilePhoto == "") {
    navigate("/login")
  }
  // Fetch user info only if logged in
  const getUser = async () => {
    try {
      if (!userId || !token) return;
      const response = await axios.get(
        `${import.meta.env.VITE_Backend_api_url}/users/${userId}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setProfilePhoto(response.data.user.profilePhoto);
    } catch (err) {
      console.log("Navbar fetch error:", err);
    }
  };

  useEffect(() => {
    getUser();
  }, [userId, token]);

  // Redirect to login if not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Auto logout after 1 hour
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/logout");
    }, 1000 * 60 * 60);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <nav className='navbar'>
      <div className='container navbar__container'>
        <Link to="/" className='navbar_logo'>CODERA</Link>

        <form className='navbar__search'>
          <input type="search" placeholder='Search' />
          <button type='submit'><CiSearch /></button>
        </form>

        <div className='navbar__right'>
          {token && userId ? (
            <Link to={`/users/${userId}`} className='navbar__profile'>
              <ProfileImage image={profilePhoto} />
            </Link>
          ) : (
            <Link to="/login">Login</Link>
          )}

          {token && <Link to="/logout">Logout</Link>}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
