import React,{useEffect,createContext, useReducer, useContext} from "react";
import './App.css'
import NavBar from "./components/Navbar";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Home from './components/screens/Home';
import Login from './components/screens/Login';
import Profile from './components/screens/Profile';
import Signup from './components/screens/Signup';
import CreatePost from "./components/screens/CreatePost";
import {reducer, initialState} from './reducers/userReducer'
import UserProfile from "./components/screens/UserProfile";
import MyHome from "./components/screens/SubscribedUserPosts"
import OnePost from "./components/screens/OnePost";
import io from "socket.io-client";

export const UserContext = createContext()


const Routing =()=>{
  const navigate = useNavigate();
  const {state, dispatch} = useContext(UserContext)
  useEffect(()=>{
    const user =JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER", payload:user})
    }
    else{
      navigate("/login")
    }
  },[])
  return(
    <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route exact path="/profile" element={<Profile />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/create" element={<CreatePost />} />
    <Route path="/profile/:userid" element={<UserProfile />} />
    <Route path="/myhome" element={<MyHome />} />
    <Route path="/post/:id" element={<OnePost/>} />
  </Routes>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer,initialState)
  useEffect(()=>{
    const socket = io("http://localhost:5000")
    console.log(socket)
  },[])
  return (
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
      <NavBar />
      <Routing className="main-content"/>
      
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;