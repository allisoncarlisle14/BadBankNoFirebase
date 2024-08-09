import React from 'react';
import Card from './card';
import FormTemplate from './formtemplate';
import {UserContext} from './context';
import { auth } from './firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getAuth, signOut } from "firebase/auth";
import Axios from 'axios';

function CreateAccount() {

    const [show, setShow] = React.useState(true);
    const [status, setStatus] = React.useState("");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [buttonDisabled, setButtonDisabled] = React.useState(true);
    const ctx = React.useContext(UserContext);
    const [data, setData] = React.useState(""); 
  
    function validateName (entry) {
      if (!entry) {
        setStatus("Error: You must enter a valid name.");
        setTimeout(() => setStatus(""), 5000);
        return false;
      }
      return true;
    }
  
    function validateEmail (entry) {
      if (!entry || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(entry)) {
        setStatus("Error: You must enter a valid email address.");
        setTimeout(() => setStatus(""), 5000);
        return false;
      } 
      return true;
    }
  
    function validatePassword(entry) {
      if (entry.length < 8) {
        setStatus("Error: You must enter a password that is at least 8 characters long.");
        setTimeout(() => setStatus(""), 5000);
        return false;
      }
      return true;
    }
  
    function change(e) {
      switch (e.currentTarget.id) {
        case "name":
          setName(e.currentTarget.value);
          break;
        case "email":
          setEmail(e.currentTarget.value);
          break;
        case "password":
          setPassword(e.currentTarget.value);
          break;
      }
      setButtonDisabled(
        !document.getElementById("name").value &&
        !document.getElementById("email").value &&
        !document.getElementById("password").value
      );
    }

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
  
  
    function handle() {
      setStatus("");
     
      if (!validateName(name)) return;
      if (!validateEmail(email)) return;
      if (!validatePassword(password)) {return};
  
      // see authentication with Firebase lecture videos and https://firebase.google.com/docs/auth/web/password-auth#create_a_password-based_account
  
      // createUserWithEmailAndPassword(auth, email, password)
      //   .then( (userCredential) => {
      //     console.log(userCredential.user); // console log Firebase user
  
          // See MDN documentation https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  
          (async function createData () {

            const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:4000";
            const url = backendUrl + `/account/create`;
            const info = {name: name, email: email, password: password};

            try {
                const response = await Axios.get(url, {params: info});
              
            //     if (!response.ok) {
            //     throw new Error (`Response status: ${response.status}`);
            //   }
            const data = await response.data;
            setData(data);
              if (data.valid) {
                ctx.currentUser.name = data.content.name;
                ctx.currentUser.email = data.content.email;
                ctx.currentUser.password = data.content.password;
                ctx.currentUser.balance = 0;
                console.log(data.content); // console log user in database
                toggleNavTabs('loggedIn', data.content.name, data.content.email);
                localStorage.setItem('token', data.token);
                setShow(false);
              } else {
                setStatus('An error occurred: ' + data.content) // maybe come up with a different name than content on the back end?
                setTimeout(() => setStatus(""), 5000);
              }
              }
              
             catch (error) {
              console.error(error.message); // error authenticating with the server 
            }
          })();
        // })
        // .catch( (error) => {
        //   console.error('Error Code: ' + error.code); // error authenticating with Firebase
        //   console.error('Error Message: ' + error.message); // error authenticating with Firebase
        //   setStatus("Firebase authentication failed.");
        //   setTimeout(() => setStatus(""), 5000);
        // })
      
    };
  
    function clearForm() {
      localStorage.removeItem('token'); 
  
      setName("");
      setEmail("");
      setPassword("");
      ctx.currentUser = {name: "",
        email: "",
        password: "",
        balance: 0
      };
      toggleNavTabs('loggedOut', '');
  
      // see authentication with Firebase lecture videos and https://firebase.google.com/docs/auth/web/password-auth
  
      // const auth = getAuth();
      //   signOut(auth).then (() => {
      //     console.log('Successfully signed out of Firebase.');
      //     setShow(true);
      //   })
      //   .catch ( (error) => {
      //     console.error('Error code: ' + error.code); // error signing out of Firebase
      //     console.error('Error message: ' + error.message); // error signing out of Firebase
      //   })
    }
    
  
    const inputFields = [
      {
        title: "Name",
        type: "input",
        id: "name",
        placeholder: "Enter name",
        value: name,
      },
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
  
    const submitButtonLabels = ["Create Account", "Create Another Account"];
  
    const formMessages = [
      "Enter your name, email address, and password to create an account.",
      "Success! You are now signed in as " + name,
    ];

    const loggedOutNavTabs = ['create-account', 'login'];
    const userNavTabs = ['deposit', 'withdraw', 'username', 'balance', 'delete-account'];
    
  
    return (
      <>
        <Card
          bgcolor="warning"
          header="Create Account"
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
  
  export default CreateAccount;