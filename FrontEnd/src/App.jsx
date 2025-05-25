import react from 'react'
import {createBrowserRouter, Router, Route, RouterProvider} from "react-router-dom"
import RootLayout from './RootLayout'
import Errrorpage from './pages/Errrorpage'
import Home from './pages/Home'
import MessagesList from './components/MessagesList'
import Bookmarks from './pages/Bookmarks'
import Profiles from './pages/Profiles'
import SinglePost from './pages/SinglePost'
import Login from './pages/Login'
import Register from './pages/Register'
import Logout from './pages/Logout'
import Messages from './pages/Messages'
import {Provider} from "react-redux"
import store from './store/store'

const router = createBrowserRouter([
  {path : "/", element : <RootLayout/>, errorElement :<Errrorpage/>, children:[
    {index : true, element : <Home/>},
    {path : "messages", element : <MessagesList/>},
    {path : "messages/:receiverId", element : <Messages/>},
    {path : "bookmarks", element : <Bookmarks/>},
    {path : "users/:id", element : <Profiles/>},
    {path : "posts/:id", element : <SinglePost/>}
  ]},
  {path : "/login", element : <Login/>},
  {path :  "/register", element : <Register/>},
  {path : "/logout",element : <Logout/>}
])



export default function App() {
  return (
  
    <Provider store={store}>
    <RouterProvider router={router}/>
    </Provider>
 
  )
}