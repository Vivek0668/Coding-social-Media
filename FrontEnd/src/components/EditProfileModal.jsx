import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

import { uiActions } from '../store/ui-slice'

const EditProfileModal = () => {
const [userData,setUserData] =  useState({fullName :"", bio : ""})
const dispatch =  useDispatch()
const token = useSelector(state=>state.user?.currentUser?.token);
const id = useSelector(state=> state.user?.currentUser?.id);




///GetUser from db

const getUser = async()=> {
  try {
   const response = await axios.get(`${import.meta.env.VITE_Backend_api_url}/users/${id}`,{
   withCredentials: true, headers : {Authorization : `Bearer ${token}`}})
   setUserData(response?.data.user)
   console.log("userDATA : ", response.data.user)
  }catch(err) {
    console.log(err);

  }
 
  }
  const handleBackdropClick = (e) => {
  if (e.target.classList.contains("editProfile")) {
    closeModal();
  }
};

  const closeModal = ()=> {
   dispatch(uiActions.closeEditProfileModal());

  }
  const changeUserData = async(e)=> {
  
         setUserData(prevData=> {
      return {...prevData, [e.target.name] : e.target.value};
     })
      
    
  
 }
  const updateUser=async(e)=> {
    e.preventDefault();
    try {
  
      const response = await axios.patch
     (`${import.meta.env.VITE_Backend_api_url}/users/edit`,userData, {
      withCredentials : true, headers : {Authorization : `Bearer ${token}`}
     })
      closeModal(e);
   
    }catch(err) {
      console.log(err);
    }
 }



  useEffect(()=>{
    getUser()
  },[])



  return (
  <section className='editProfile' onClick={e => handleBackdropClick(e)}>
    <div className= "editProfile__container">
      <h3>Edit Profile</h3>
      <form onSubmit={updateUser}>
        <input type= "text" name = 'fullName' value={userData?.fullName} 
        onChange={changeUserData} placeholder='Full Name'/>
        <textarea name='bio' value={userData?.bio} onChange={changeUserData} placeholder='Bio'/>
        <button type='submit' className='btn primary'>Update</button>
      </form>
    </div>
  </section>
  )
}

export default EditProfileModal