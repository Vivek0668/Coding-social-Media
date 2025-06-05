import React, { useState ,useEffect} from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios';
import FriendRequest from './FriendRequest';

const FriendRequests = () => {
const [friends,setFriends] = useState([])
const token = useSelector(state=> state.user?.currentUser?.token);
const userId = useSelector(state=>state?.user?.currentUser?.id)


const getUsers = async()=> {
    try {
    const response = await axios.get(`${import.meta.env.VITE_Backend_api_url}/users`, {
        withCredentials: true,headers : {Authorization : `Bearer ${token}`}
    })
    const filterdFriends  = response.data.allUsers.
    filter(f => !f.followeres.includes(userId) && f._id !== userId)
    setFriends(filterdFriends);
    console.log(filterdFriends)
    }catch(err) {
        console.log(err)
    }


}
const closeFriendBadge=(id)=> {
    setFriends(friends.filter(friend => friend._id != id))

}
useEffect(()=>{
    
    getUsers()

},[])



  return (
    <menu className='friendRequests'>
    <h3>Suggested Friends</h3>
{
    friends?.map(friend=><FriendRequest key={friend._id} friend= {friend}
        onFilterFriend = {closeFriendBadge}
    />)
    }
    </menu>
  )
}

export default FriendRequests