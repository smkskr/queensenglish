import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './Login.css';

async function loginUser(credentials) {
    return fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
      .then(data => data.json())
      .catch(err => err.json())
   }

   async function register(credentials) {

    console.log(credentials);
    return fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
      .then(data => data.json())
      .catch(err => err.json())
   }
 
export default function Login({ setToken }) {

let [authMode, setAuthMode] = useState("signin")
const [errorMessage, setErrorMessage] = useState('');
const [username, setUserName] = useState('');
const [password, setPassword] = useState('');
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [isCreator,setIsCreator]= useState(false);
const [isViewer,setIsViewer]= useState(false);
const [isViewAll,setIsViewAll]= useState(false);
const [formErrors,setFormErrors] = useState({});
let rolesList = [];

let roles = {
  'CREATOR': isCreator,
  'VIEWER': isViewer,
  'VIEW_ALL': isViewAll 
}
const changeAuthMode = () => {
  setAuthMode(authMode === "signin" ? "signup" : "signin")
  setErrorMessage('');
  setFormErrors({});
  setUserName('');
  setEmail('');
  setPassword('');
  setName('');
  setIsCreator(false);
  setIsViewAll(false);
  setIsViewer(false);
}

const handleValidation = (type) => {
  let formIsValid = true;
  let errors = {};
  //UserName
  if (!username) {
    formIsValid = false;
    errors["username"] = "Username Cannot be empty";
  }

   //Password
   if(!password){
    formIsValid = false;
    errors["password"] = "Password Cannot be empty";
  }

  if(type === 'login'){
    setFormErrors(errors);
    return formIsValid;
  }

  //Email
  if (!email) {
    formIsValid = false;
    errors["email"] = "Email Cannot be empty";
  }

  if (typeof email !== "undefined") {
    let lastAtPos = email.lastIndexOf("@");
    let lastDotPos = email.lastIndexOf(".");

    if (
      !(
        lastAtPos < lastDotPos &&
        lastAtPos > 0 &&
        email.indexOf("@@") === -1 &&
        lastDotPos > 2 &&
        email.length - lastDotPos > 2
      )
    ) {
      formIsValid = false;
      errors["email"] = "Email is not valid";
    }
  }

 
  //Name
  if(!name){
    formIsValid = false;
    errors["name"] = "Name Cannot be empty";
  }

  if (typeof name !== "undefined") {
    if (!name.match(/^[a-zA-Z ]+$/)) {
      formIsValid = false;
      errors["name"] = "Name should contain only letters";
    }
  }

var count = 0;
for(var key in roles){
  if(roles[key] === false){
      count+=1;
  }else{
    rolesList.push(key);
  }
}
if(count === 3)errors["role"] = "Please select atleast one role";

  setFormErrors(errors);
  return formIsValid;
}

  
  const handleLogin = async e => {
    e.preventDefault();

    if (handleValidation('login')) {
      const res = await loginUser({
        username,
        password
      });
      if(res.success === false){
        setErrorMessage(res.message)
      }else{
        sessionStorage.setItem('token', res.data.token);
        sessionStorage.setItem('username', res.data.username);
        sessionStorage.setItem('role', res.data.role);
        setToken(res.data.token);
      }
    }
   

  }

  
  
const registerUser = async e => {
  e.preventDefault();

 
  if (handleValidation('signup')) {
    let role = rolesList.toString();
    console.log(role);
    const res = await register({
      username,
      password,
      email,
      role,
      name
    });

    setErrorMessage(res.message);
  }

  

}

const toggleChangeCreator = () => {
  setIsCreator(!isCreator);
  roles['CREATOR'] = isCreator;
}

const toggleChangeViewer = () => {
  setIsViewer(!isViewer);
  roles['VIEWER'] = isViewer;
}

const toggleChangeViewAll = () => {
  setIsViewAll(!isViewAll);
  roles['VIEW_ALL'] = isViewAll;
}

 
  if (authMode === "signin") {
  return(

    <div className="Auth-form-container">  
      <form className="Auth-form" onSubmit={handleLogin}>
      <div className="Auth-form-content">
          <h3 className="Auth-form-title">Sign In</h3>
          <div className="text-center">
              Not registered yet?{" "}
              <span className="link-primary" onClick={changeAuthMode}>
                Sign Up
              </span>
            </div>
          <div className="form-group mt-3">
          <label>
          <p>Username</p>
          <input type="text" className="form-control mt-1" placeholder="Enter Username" value={username} onChange={e => setUserName(e.target.value)}/>
          <span className='error'>{formErrors.username}</span>
        </label>
        </div>
        <div className="form-group mt-3">
        <label>
          <p>Password</p>
          <input type="password" className="form-control mt-1" placeholder="Enter Password" value={password} onChange={e => setPassword(e.target.value)}/>
          <span className='error'>{formErrors.password}</span>
        </label>
        </div>
        {errorMessage && (
        <p className="error"> {errorMessage} </p>
        )}
        <div className="d-grid gap-2 mt-3">
        <button type="submit" className="btn btn-primary">Login</button>
        </div>
          </div>    
      </form>
    </div>
  )
}


return(

  <div className="Auth-form-container">  
  <form className="Auth-form" onSubmit={registerUser}>
  <div className="Auth-form-content">
      <h3 className="Auth-form-title">Sign Up</h3>
      <div className="text-center">
            Already registered?{" "}
            <span className="link-primary" onClick={changeAuthMode}>
              Sign In
            </span>
        </div>
      <div className="form-group mt-3">
      <label>
          <p>Username</p>
          <input type="text" className="form-control mt-1"  value={username} placeholder="Enter Username" onChange={e => setUserName(e.target.value)}/>
         <span className='error'>{formErrors.username}</span>
        </label>
    </div>
    <div className="form-group mt-3">
    <label>
          <p>Password</p>
          <input type="password" className="form-control mt-1" value={password} placeholder="Enter Password" onChange={e => setPassword(e.target.value)}/>
          <span className='error'>{formErrors.password}</span>
        </label>
    </div>
    <div className="form-group mt-3">
    <label>
          <p>Name</p>
          <input type="text" className="form-control mt-1" value={name} placeholder="Enter Name" onChange={e => setName(e.target.value)}/>
          <span className='error'>{formErrors.name}</span>
        </label>
      </div>
      <div className="form-group mt-3">
      <label>
          <p>Email</p>
          <input type="email" className="form-control mt-1" value={email} placeholder="Enter Email" onChange={e => setEmail(e.target.value)}/>
          <span className='error'>{formErrors.email}</span>
        </label>
      </div>
      <div className="form-group mt-3">
        <label><p>ROLE</p></label>
        <div>
            <label className="form-check-label">
              <input type="checkbox"
                checked={isCreator}
                value={isCreator}
                onChange={toggleChangeCreator}
                className="form-check-input"
              />
              CREATOR
            </label>
            </div>
            <div>
            <label className="form-check-label">
              <input type="checkbox"
                checked={isViewer}
                value={isViewer}
                onChange={toggleChangeViewer}
                className="form-check-input"
              />
              VIEWER
            </label>
            </div>
            <div>
            <label className="form-check-label">
              <input type="checkbox"
                checked={isViewAll}
                value={isViewAll}
                onChange={toggleChangeViewAll}
                className="form-check-input"
              />
              VIEW ALL
            </label>
            </div>
            <span className='error'>{formErrors.role}</span>
          </div>
      {errorMessage && (
        <p className="error"> {errorMessage} </p>
        )}
    <div className="d-grid gap-2 mt-3">
    <button type="submit" className="btn btn-primary">Register</button>
    </div>
      </div>    
  </form>
</div>

)

}
Login.propTypes = {
  setToken: PropTypes.func.isRequired
};