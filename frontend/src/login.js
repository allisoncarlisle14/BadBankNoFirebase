import React from 'react';
import Card from './card';
import FormTemplate from './formtemplate';
import {UserContext} from './context';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import Axios from 'axios';

function Login() {
    const [show, setShow] = React.useState(true);
    const [status, setStatus] = React.useState("");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [buttonDisabled, setButtonDisabled] = React.useState(true);
    const ctx = React.useContext(UserContext);
    const [data, setData] = React.useState(""); 
    
  
    function validateEmail (entry) {
      if (!entry || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(entry)) {
        setStatus("Error: You must enter a valid email address.");
        setTimeout(() => setStatus(""), 5000);
        return false;
      } 
      return true;
    }
  
    function validatePassword(entry) {
      if (!entry) {
        setStatus("Error: You must enter a password.");
        setTimeout(() => setStatus(""), 5000);
        return false;
      }
      return true;
    }
    
    function change(e) {
      switch (e.currentTarget.id) {
        case "email":
          setEmail(e.currentTarget.value);
          break;
        case "password":
          setPassword(e.currentTarget.value);
          break;
      }
      setButtonDisabled(
        !document.getElementById("email").value &&
          !document.getElementById("password").value
      );
    }
  
  //const auth = getAuth();
  function toggleNavTabs( status, userName, userEmail) {
    if (status === 'loggedIn') {
      loggedOutNavTabs.forEach(tab => document.getElementById(tab).style.display = 'none');
      userNavTabs.forEach(tab => document.getElementById(tab).style.display = 'inline');
      document.getElementById('navbarDropdown').innerHTML = userName;

      if (userEmail === 'fury@shield.org') {
        document.getElementById('all-data').style.display = 'inline';
      }
    } else if (status === 'loggedOut') {
      loggedOutNavTabs.forEach(tab => document.getElementById(tab).style.display ='inline');
        userNavTabs.forEach(tab => document.getElementById(tab).style.display = 'none');
        document.getElementById('navbarDropdown').innerHTML = '';
        document.getElementById('all-data').style.display = 'none';
    }
  }
  
  function updateCtxCurrentUser (response) {
    ctx.currentUser.name = response.name;
    ctx.currentUser.email = response.email;
    ctx.currentUser.password = response.password;
    ctx.currentUser.balance = response.balance;
  }
  
    function handle() {
      setStatus("");
      if (!validateEmail(email)) return;
      if (!validatePassword(password)) return;
  
      // see authentication with Firebase lecture videos and:
      // https://firebase.google.com/docs/auth/web/password-auth
      // const auth = getAuth();
      // signInWithEmailAndPassword(auth, email, password)
      //   .then( (userCredential) => {
      //     console.log(userCredential.user); // console log Firebase user
  
          // See MDN documentation:
          // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  
          (async function getData () {
            const info = {email: email, password: password};
            const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:4000";
            const url = backendUrl + `/account/login`;
  
          try {
              const response = await Axios.get(url, {params: info});
              
            //   if (!response.ok) {
            //     throw new Error (`Response status: ${response.status}`);
            //   }
              
              const data = await response.data;
              setData(data);
              console.log(data.content); // console log data from the server
              if (data.valid) {
                updateCtxCurrentUser(data.content);
                setName(data.content.name);
                toggleNavTabs('loggedIn', data.content.name, data.content.email);
                localStorage.setItem('token', data.token);
                setShow(false);
              } else {
                setStatus('An error occurred: ' + data.content) 
                setTimeout(() => setStatus(""), 5000);
              }
            }
              catch (error) {
              console.error(error.message); // error authenticating with the server 
            }
          })();
        // })
        // .catch((error) => {
        //   console.log('Error Code: ' + error.code); // error authenticating with Firebase
        //   console.log('Error Message: ' + error.message); // error authenticating with Firebase
        //   setStatus('Firebase authentication failed.');
        //   setTimeout(() => setStatus(""), 5000);
        // })
    }
  
    function clearForm() {
      localStorage.removeItem('token');
      setName("");
      setEmail("");
      setPassword("");
      setButtonDisabled(true);
      ctx.currentUser = {name: "",
        email: "",
        password: "",
        balance: 0
      };
      toggleNavTabs('loggedOut', '');
      // const auth = getAuth();
      // signOut(auth).then ( () => {
      //     console.log('Successfully signed out.');
      //     setShow(true);
      //   })
      //   .catch ( (error) => {
      //     console.log('Error code: ' + error.code);
      //     console.log('Error message: ' + error.message);
      //   })

      // (async function disconnectFromDatabase () {

      // try {
      //   const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:4000";
      //   const url = backendUrl + `/account/logout`;
      //     const response = await Axios.get(url);
      //     const data = await response.data;
          
      //     console.log(data.content); // console log data from the server
    
      //   }
      //     catch (error) {
      //     console.error(error.message); // error authenticating with the server 
      //   }
      // })();
    }
  
    const inputFields = [
      {
        title: "Email",
        type: "input",
        id: "email",
        placeholder: "Enter email",
        value: email,
      },
      {
        title: "Password",
        type: "password",
        id: "password",
        placeholder: "Enter password",
        value: password,
      },
    ];
  
    const submitButtonLabels = ["Log In", "Log Out"];
  
    const formMessages = ["Welcome.", "Welcome, " + name + "."];
  
    const loggedOutNavTabs = ['create-account', 'login'];
    const userNavTabs = ['deposit', 'withdraw', 'username', 'balance', 'delete-account'];
  
    return (
      <>
        <Card
          bgcolor="primary"
          header="Login"
          status={status}
          body={
            <FormTemplate
              show={show}
              formMessages={formMessages}
              data={inputFields}
              onChange={change}
              disabled={buttonDisabled}
              onClick={handle}
              submitButtonLabels={submitButtonLabels}
              onClear={clearForm}
            />
          }
        />
      </>
    );
  }

  export default Login;