import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {CiSearch} from 'react-icons/ci'
import { useSelector } from 'react-redux'
import ProfileImage from './ProfileImage'
import { useEffect } from 'react'

const Navbar = () => {
  const navigate = useNavigate();
 const userId = useSelector(state=> state?.user?.currentUser?.id)
 const token = useSelector(state=> state?.user?.currentUser?.token)
  const profilePhoto = useSelector(state=> state?.user?.currentUser?.profilePhoto);
console.log(userId, token, profilePhoto);




//redirect the user if not logged in 
 useEffect(()=> {
  if(!token) {
    navigate("/login")
  }

 },[])


 //Log user out after certain time
 useEffect(()=> {
  setTimeout(()=> {
    navigate("/logout")
  },1000* 60* 60);

 },[])



 




return (
  <div>
    <nav className='navbar' >
      <div className='container navbar__container'>
        <Link to="/" className='navbar_logo'>CODERA</Link>
        <form className='navbar__search'>
          <input type="search" placeholder='Search'/>
          <button type='submit'><CiSearch/></button>
        </form>
        <div className='navbar__right'>
          <Link to={`/users/${userId}`}  className='navbar__profile'>
          <ProfileImage image={profilePhoto}/>
           </Link>
           {token ? <Link to="/logout">Logout</Link> : <Link to="/login">Login</Link>}
        </div>
      </div>
    </nav>
  </div>
)
}
export default Navbar
