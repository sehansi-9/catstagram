import React, { useEffect } from "react";
import './App.css'
import NavBar from "./components/Navbar";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Home from './components/screens/Home';
import Login from './components/screens/Login';
import Profile from './components/screens/Profile';
import Signup from './components/screens/Signup';
import CreatePost from "./components/screens/CreatePost";
import UserProfile from "./components/screens/UserProfile";
import MyHome from "./components/screens/SubscribedUserPosts"
import OnePost from "./components/screens/OnePost";
import io from "socket.io-client";
import { API_URL } from './config/api';
import { Provider, useDispatch } from 'react-redux';
import { store } from './redux/store';
import { login } from './redux/userSlice';


const Routing = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (user) {
      dispatch(login(user))
    }
    else {
      // Check if we are on a public route before redirecting
      const publicRoutes = ['/login', '/signup'];
      if (!publicRoutes.includes(window.location.pathname)) {
        navigate("/login")
      }
    }
  }, [dispatch, navigate])
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route exact path="/profile" element={<Profile />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/create" element={<CreatePost />} />
      <Route path="/profile/:userid" element={<UserProfile />} />
      <Route path="/myhome" element={<MyHome />} />
      <Route path="/post/:id" element={<OnePost />} />
    </Routes>
  )
}
const socket = io(API_URL)
console.log(socket)

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <NavBar />
        <Routing className="main-content" />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
