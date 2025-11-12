import React, {useEffect, useState } from 'react'
import { Link,useNavigate } from 'react-router-dom';
import axios from "axios";

const Signup = () => {
    const[name,setname]=useState("");
    const[email,setemail]=useState("");
    const[phno,setphno]=useState("");
    const[password,setpassword]=useState("");
    const[conpassword,setconpassword]=useState("");
    const[msg,setmsg]=useState("");
    const navigate=useNavigate();
    
    const submit=async (e)=>{
      e.preventDefault();
       if(password.length<8){
        setmsg("Password length must be atleast 8 characters");
        return;
      }
      if(!name||!email||!phno||!password||!conpassword||!conpassword){
        setmsg("All fields are required");
        return;
      }
     
      if(password!=conpassword){
        setmsg("password is not matched");
        return;
      }
      try{
       const res=await axios.post("http://localhost:5000/signup",{
        name,
        email,
        phno,
        password,
       },)
       alert(res.data.msg);
        navigate('/login');
        setname("");
        setemail("");
        setphno("");
        setpassword("");
        setconpassword("");
      }
      catch(err){
          setmsg(err.response?.data?.msg || err.message || "Something went wrong");
      }
    }
    
    useEffect(()=>{
        setname("");
        setemail("");
        setphno("");
        setpassword("");
        setconpassword("");
      },[])

    // Styles
    const styles = {
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
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer',
            marginBottom: '15px'
        },
        buttonHover: {
            backgroundColor: '#0056b3'
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
      <h1 style={styles.heading}>Signup page</h1>
      <form onSubmit={submit}>
        <div style={styles.container}>
          <label style={styles.label}>Name</label>
          <input 
            type="text" 
            onChange={(e)=>setname(e.target.value)} 
            required 
            style={styles.input}
            value={name}
          />
          
          <label style={styles.label}>Email</label>
          <input 
            type="email"
            onChange={(e)=>setemail(e.target.value)} 
            required 
            style={styles.input}
            value={email}
          />
          
          <label style={styles.label}>Phone Number</label>
          <input 
            type="number"
            onChange={(e)=>setphno(e.target.value)} 
            required 
            style={styles.input}
            value={phno}
          />
          
          <label style={styles.label}>Password</label>
          <input 
            type="password"
            onChange={(e)=>setpassword(e.target.value)} 
            required 
            style={styles.input}
            value={password}
          />
          
          <label style={styles.label}>Confirm Password</label>
          <input 
            type="password" 
            onChange={(e)=>setconpassword(e.target.value)} 
            required 
            style={styles.input}
            value={conpassword}
          />
          
          <br/>
          <button 
            type='submit'
            style={styles.button}
            onMouseOver={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
            onMouseOut={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
          >
            Submit
          </button>
          
          <p style={styles.text}>
            Already have an account? <Link to="/login" style={styles.link}>Login</Link>
          </p>
          
          <p style={styles.message}>{msg}</p>
        </div>
      </form>
    </>
  )
}

export default Signup;