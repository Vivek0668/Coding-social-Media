import React, { useEffect, useState } from 'react'
import axios from  "axios"
import {useNavigate, useParams} from "react-router-dom"
import {useSelector} from "react-redux"
import {LuUpload} from "react-icons/lu"
import {FaCheck} from "react-icons/fa"
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {userActions} from "../store/user-slice"
import {uiActions} from "../store/ui-slice"

const Userprofile = () => {
const navigate = useNavigate();
const currentUser = useSelector(state=> state.user?.currentUser)
const dispatch = useDispatch();
const {id: userId} = useParams();
const token  = useSelector(state=> state.user?.currentUser?.token);
const [user,setUser] = useState({});
const loggedInUser = useSelector(state=> state.user?.currentUser?.id);
const [followsUser, setFollowsUser] = useState(user?.followeres?.includes(loggedInUser))
const [avatar,setAvatar] = useState(user?.profilePhoto)
const [avatarTouched,setAvatarTouched] = useState(false);


    const getUser =async()=> {
        try {
               const response  = await axios.get
        (`${import.meta.env.VITE_Backend_api_url}/users/${userId}`,
             {withCredentials:true, headers: {Authorization: `Bearer ${token}`}})
             setUser(response.data.user)
             setFollowsUser(response.data.user?.followeres.includes(loggedInUser))
             setAvatar(response.data?.user?.profilePhoto)
        }catch(err) {
            console.log(err)
        }
   }


   
    const changeAvatarHandler= async(e)=> {
        e.preventDefault();
        setAvatarTouched(true)
        try {
            const postData = new FormData()
            postData.set("avatar", avatar)
             const response = await axios.post
        (`${import.meta.env.VITE_Backend_api_url}/users/avatar`,postData,
            {withCredentials : true, headers: {Authorization : `Bearer ${token}`}}
        ) 
        dispatch(userActions.changeCurrentUser
            ({...currentUser, profilePhoto : response.data?.profilePhoto}))
        navigate(0)
        
        }catch(err) {
            console.log(err)

        }
       
        
    }


    const openEditProfileModal =()=> {
        dispatch(uiActions.openEditProfileModal())

    }

    const followUnfollowUser =async()=> {
         try {
            setFollowsUser(!followsUser)
            await axios.get
            (`${import.meta.env.VITE_Backend_api_url}/users/${userId}/follow-unfollow`,{
                withCredentials: true, headers : {Authorization : `Bearer ${token}`}
            })
          
            
         }catch(err) {
           setFollowsUser(!followsUser)
            console.log(err)
         }
        
    }

       useEffect(()=> {
    getUser()
   },[userId, followUnfollowUser,avatar])

  return (
    <section className='profile'>
        <div className='profile__container'>
            <form className='profile__image' encType='multipart/form-data' 
            onSubmit={changeAvatarHandler}> 
            <img src={user?.profilePhoto} alt=''/>
            { !avatarTouched ? 
            <label htmlFor='avatar'  className='profile__image-edit'>
         <span> <LuUpload/></span>  
         </label> :
         <button type='submit' className='profile__image-btn'><FaCheck/></button>}
         <input
       type='file' name='avatar' id='avatar' onChange={e=> {setAvatar(e.target.files[0]);
       setAvatarTouched(true)}}  accept='png, jpg, jpeg'/>
            </form>
            <h4> {user?.fullName}</h4>
            <small>{user?.email}</small>
            <ul className='profile__follows'>
                <li>
                    <h4>{user?.following?.length}</h4>
                    <small>Following</small>
                </li>

                 <li>
                    <h4>{user?.followeres?.length}</h4>
                    <small>Followers</small>
                </li>
                 <li>
                    <h4>0</h4>
                    <small>Likes</small>
                </li>
            </ul>

            <div className='profile__actions-wrapper'>
                {user._id == loggedInUser? <button className='btn' 
                onClick={openEditProfileModal}>Edit Profile</button> :
                <button onClick={followUnfollowUser} className='btn dark'>{followsUser? "Unfollow" : 
                "Follow" }</button>}
                {user?._id!= loggedInUser &&  <Link to={`/messages/${user?._id}`} 
                className='btn default'>Message</Link>}
            </div>
            <article className ="profile__bio">
                <p>{user?.bio}</p>
            </article>
            
        </div>
    </section>
  )
}

export default Userprofile