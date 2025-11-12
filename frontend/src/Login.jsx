import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Signup from './Signup';
import axios from 'axios';

const Login = () => {
  const[email,setemail]=useState("");
  const[password,setpassword]=useState("");
  const[msg,setmsg]=useState("");
  const navigate=useNavigate();
  
  const submit=async (e)=>{
    e.preventDefault();
     try{
        const res=await axios.post("http://localhost:5000/login",{
          email,
          password
        }, { withCredentials: true })
        alert(res.data.msg);
        navigate('/home')
     }
     catch(err){
         setmsg(err.response?.data?.msg || err.message || "Something went wrong");
     }
  }

  // Styles for Login component
  const loginStyles = {
    container: {
        maxWidth: '400px',
        margin: '50px auto',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#f9f9f9',
        fontFamily: 'Arial, sans-serif'
    },
    heading: {
        textAlign: 'center',
        color: '#333',
        marginBottom: '30px',
        fontSize: '28px',
        fontWeight: 'bold'
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: 'bold',
        color: '#555'
    },
    input: {
        width: '100%',
        padding: '12px',
        marginBottom: '20px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '16px',
        boxSizing: 'border-box'
    },
    button: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        cursor: 'pointer',
        marginBottom: '15px'
    },
    buttonHover: {
        backgroundColor: '#218838'
    },
    link: {
        color: '#007bff',
        textDecoration: 'none',
        fontWeight: 'bold'
    },
    message: {
        textAlign: 'center',
        color: 'red',
        marginTop: '15px',
        fontSize: '14px'
    },
    text: {
        textAlign: 'center',
        marginTop: '15px',
        color: '#666'
    }
  };

  return (
    <>
      <div style={loginStyles.container}>
        <h1 style={loginStyles.heading}>Login Page</h1>
        <form onSubmit={submit}>
          <label style={loginStyles.label}>Email</label>
          <input 
            type="text"
            onChange={(e)=>setemail(e.target.value)}
            style={loginStyles.input}
            value={email}
          />
          
          <label style={loginStyles.label}>Password</label>
          <input 
            type="password"
            onChange={(e)=>setpassword(e.target.value)}
            style={loginStyles.input}
            value={password}
          />
          
          <button 
            type="submit"
            style={loginStyles.button}
            onMouseOver={(e) => e.target.style.backgroundColor = loginStyles.buttonHover.backgroundColor}
            onMouseOut={(e) => e.target.style.backgroundColor = loginStyles.button.backgroundColor}
          >
            Submit
          </button>
          
          <p style={loginStyles.text}>
            Don't have an account? <Link to="/signup" style={loginStyles.link}>Signup</Link>
          </p>
          
          <p style={loginStyles.message}>{msg}</p>
        </form>
      </div>
    </>
  )
}

export default Login
