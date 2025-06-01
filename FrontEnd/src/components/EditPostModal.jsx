import axios from 'axios';
import React, { useEffect,useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { uiActions } from '../store/ui-slice';
import e from 'cors';

const EditPostModal = ({onUpdatePost}) => {
    const postId = useSelector(state=> state?.ui.editPostId);
    const token = useSelector(state=> state?.user?.currentUser?.token);
    const[body,setBody] = useState("")
    const dispatch  = useDispatch();


    //get Post for edit

    const getPost = async()=> {
        // console.log(postId)
        try {
            const response = await axios.get
            (`${import.meta.env.VITE_Backend_api_url}/posts/${postId}`,{
                withCredentials : true, headers : {Authorization : `Bearer ${token}`}
            })
            setBody(response?.data?.body)


        }catch(err) {
            console.log(err)
        }
    }

    const updatePost = async()=> {
        
        const postData = new FormData();
        postData.set("body",body)
       onUpdatePost(postData,postId)
       dispatch(uiActions?.closeEditPostModal())

    }
    const closeEditPostModal =(e)=> {
        if(e.target.classList.contains('editPost')) {
            dispatch(uiActions.closeEditPostModal())
        }
 
    }


    useEffect(()=>{
        getPost()
    },[])
  return (
     <form className='editPost' onSubmit={updatePost} onClick={closeEditPostModal}>
        <div className='editPost__container'>
            <textarea value={body} onChange={(e)=> setBody(e.target.value)}
                placeholder="What's on your mind" autoFocus/>
          <button type='submit' className='btn primary'>Update Post</button>
        </div>
     </form>
  )
}

export default EditPostModal