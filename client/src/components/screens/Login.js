import React, { useState, useContext } from "react";
import {UserContext} from '../../App'
import { Link, useNavigate } from 'react-router-dom';
import M from 'materialize-css';

const Login= ()=>{
  const {state, dispatch} =useContext(UserContext)
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const PostData = () => {
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
     return M.toast({html: 'Invalid Email', classes: "red darken-2"})
    }
    fetch("/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        password: password,
        email: email
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log(data)
      if (data.error) {
        M.toast({html: data.error, classes: "red darken-2"});
      } else {
        localStorage.setItem("jwt",data.token)
        localStorage.setItem("user",JSON.stringify(data.user))
        dispatch({type:"USER",payload:data.user})
        M.toast({html: "Logged in successfully", classes: "green darken-2"});
        navigate('/');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      M.toast({html: 'An error occurred', classes: "red darken-2"});
    });
  }




    return(
     <div className="mycard">
      <div className="card auth-card input-field ">
        <h2>Catstagram</h2>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn waves-effect waves-light deep-purple accent-4" onClick={PostData}>
          Login</button>
        <h6>
            <Link to="/signup">Do not have an account?</Link>
        </h6>
        
      </div>
     </div>   
    )
}

export default Login