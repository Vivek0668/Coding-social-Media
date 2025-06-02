import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { Form } from 'react-router-dom'

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

  const closeModal = ()=> {
   
  }
  const changeUserData =()=> {

  }
  const updateUser=()=> {

  }



  useEffect(()=>{
    getUser()
  },[])



  return (
  <section className='editProfile' onClick={e => closeModal(e)}>
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