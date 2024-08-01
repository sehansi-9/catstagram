import React, { useContext } from "react";
import {Link, useNavigate} from 'react-router-dom'
import {UserContext} from '../App'

const NavBar = () => {
    const {state,dispatch} =useContext(UserContext)
    const navigate = useNavigate()
    const renderList = ()=>{
      if(state){
          return [
            <nav className="orange darken-1 nav">
                <div className="vertical-nav-wrapper  orange darken-1">
                    <Link to={state?"/":"login"} className="vertical-nav-list brand-logo">Catstagram</Link>


                          <ul className="vertical-nav-list">

                                <li><Link to="/myhome"> <i className="material-icons">home</i> <span>Home</span></Link></li>
                                <li><Link to="/create"><i className="material-icons">add_circle</i> <span>Post</span></Link></li>
                                <li><Link to="/profile"><i className="material-icons">notifications</i> <span>Notifications</span></Link></li>
                                <li><Link to="/profile"><i className="material-icons">message</i> <span>Chat</span></Link></li>
                                <li><Link to="/profile"><i className="material-icons">person_outline</i> <span>Profile</span></Link></li>
            
                                <li>
                                      <button className="btn waves-effect waves-light deep-purple accent-4" id="logout"
                                        onClick= {()=>{
                                                      localStorage.clear()
                                                      dispatch({type:"CLEAR"})
                                                      navigate('/login')
                                                      }}>
                                            Logout
                                      </button>
                                </li>
                            </ul>
                  </div>
              </nav>
          ]
      }
      
    }
  return (
    
         renderList()
      
  );
}

export default NavBar;