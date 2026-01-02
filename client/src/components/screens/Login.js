import React, { useState, useContext } from "react";
import { UserContext } from '../../App'
import { Link, useNavigate } from 'react-router-dom';
import M from 'materialize-css';
import { signin } from '../../services/authService';

const Login = () => {
  const { state, dispatch } = useContext(UserContext)
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const PostData = async () => {
    try {
      const data = await signin({ name, password });

      if (data.error) {
        M.toast({ html: data.error, classes: "red darken-2" });
      } else {
        localStorage.setItem("jwt", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        dispatch({ type: "USER", payload: data.user });
        M.toast({ html: "Logged in successfully", classes: "green darken-2" });
        navigate('/');
      }
    } catch (error) {
      console.error('Error:', error);
      M.toast({ html: 'An error occurred', classes: "red darken-2" });
    }
  }




  return (
    <div className="mycard">
      <div className="card auth-card input-field ">
        <h2>Catstagram</h2>
        <input
          type="text"
          placeholder="user name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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