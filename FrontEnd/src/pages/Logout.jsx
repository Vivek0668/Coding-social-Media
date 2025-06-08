import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { userActions } from '../store/user-slice'



const Logout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();

  useEffect(()=>{
    dispatch(userActions.changeCurrentUser())
    localStorage.setItem("currentUser", null);
    navigate('/login')

  },[])


  return (


    <div>

     
    </div>
  )
}

export default Logout
