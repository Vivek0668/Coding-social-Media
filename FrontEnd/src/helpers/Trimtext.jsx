import React from 'react'

const Trimtext = ({item,maxLength}) => {
  return (
    <>
    {item.length > maxLength ? item?.substring(0,maxLength) + "..." : item}
   </>
    
  )
}

export default Trimtext
