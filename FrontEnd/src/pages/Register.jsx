import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {FaEye, FaEyeSlash} from "react-icons/fa"
import axios, {Axios} from "axios"





const Register = () => {


  
const [user,setUser] = useState({fullName : "", email : "", password : "", confirmPassword : ""})
const[error,setError] = useState("")
const[showPassword,setShowPassword] = useState(false)
const[showConfirmPassword,setShowConfirmPassword] = useState(false)
const navigate = useNavigate();
 const changeInputHandler = (e)=> {
  setUser(prevState=> ({...prevState, [e.target.name]: e.target.value}))

 }

const registerUser = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(`${import.meta.env.VITE_Backend_api_url}/users/register`, user);
    console.log(response.data); 
    if (response.status === 200) {
      console.log("Navigating to login...");
      navigate("/login");
    }
  } catch (err) {
    setError(err.response?.data?.message || "Something went wrong");
  }
};



  return (
  <section className='register'>
  <div
  className='container register__container' >
  <h2>Sign Up</h2>
  <form onSubmit={registerUser}>
    {error &&<p className='form__error-message'>{error}</p>}
    <input type = "text" placeholder='Full Name' name='fullName' onChange={changeInputHandler}
     autoFocus
    />
    <input type="text" name='email' placeholder='Email' onChange={changeInputHandler}/>
    <div className='password__controller'>
      <input type= {showPassword ? "text" : "password"} placeholder='Password' name="password" onChange={changeInputHandler}/>
      <span onClick={()=> {
        setShowPassword(!showPassword)
      }}
      >{showPassword ? <FaEyeSlash/> : <FaEye/>}</span>
      </div>

       <div className='password__controller'>
      <input type= {showConfirmPassword? "text" : "password"} placeholder='Confirm Password' name="confirmPassword" onChange={changeInputHandler}/>
      <span
      onClick={()=> {
        setShowConfirmPassword(!showConfirmPassword)
      }}
      >{showConfirmPassword ? <FaEyeSlash/> : <FaEye/>}</span>
      {console.log(user)}
      </div>
      <p>Already have an account? <Link to="/login">Sign In</Link></p>
      <button type='submit' className='btn primary'>Register</button>
   

  </form>

  </div>
  </section>
  )
}

export default Register
