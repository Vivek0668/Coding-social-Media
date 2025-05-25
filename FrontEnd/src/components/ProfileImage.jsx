import React from 'react'

const ProfileImage = ({image}) => {
  return (
    <div className='profileImage' >
    <img  src={image} alt="profilePhoto"/>
      
    </div>
  )
}

export default ProfileImage
