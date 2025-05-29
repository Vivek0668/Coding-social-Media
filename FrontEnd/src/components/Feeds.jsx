import React from 'react'
import Feed from "../components/Feed"


const Feeds = ({posts,setPosts}) => {

    return (
        
<div className='feeds'>
{posts?.length<1 ? <p className='center'>"No posts found"</p> :posts.map((post)=> {
    return <Feed key= {post._id} post = {post}/>

}) }

</div> 

  )
}

export default Feeds
