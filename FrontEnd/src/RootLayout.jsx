import React, { useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Widgets from './components/Widgets'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ThemeModal from './components/ThemeModal'
const RootLayout = () => {

  const themeModalisOpen = useSelector(state=> state?.ui?.themeModalIsOpen)
  const {primaryColor, backgroundColor} = useSelector(state=> state?.ui?.theme)

  useEffect(()=>{
    const body = document.body;
    body.className = `${backgroundColor} ${primaryColor}` 
    },[backgroundColor, primaryColor])

  return (
   <>
    <Navbar/>
    <main
    className='main'>
    <div className='container main__container'>
    <Sidebar/>
    <Outlet/>
    <Widgets/>  

    {themeModalisOpen && <ThemeModal/>}
  </div>

    </main>   
   </>
  )
}

export default RootLayout
