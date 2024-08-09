import React from 'react';
import Card from './card';
import FormTemplate from './formtemplate';
import {Routes, Route} from 'react-router-dom';
import {UserContext} from './context';
import CreateAccount from './createaccount';
import { getAuth, deleteUser } from "firebase/auth";
import Axios from 'axios';

function DeleteAccount() {
    const [show, setShow] = React.useState(true);
    const [status, setStatus] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [buttonDisabled, setButtonDisabled] = React.useState(true);
    const ctx = React.useContext(UserContext);
    const [data, setData] = React.useState(""); 
  
    function validate(field) {
      if (!field) {
        setStatus("Error: required field.");
        setTimeout(() => setStatus(""), 5000);
        return false;
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(field)){
        setStatus("Error: You must enter a valid email address.");
        setTimeout(() => setStatus(""), 5000);
        return false;
      } else if (email !== ctx.currentUser.email) {
        console.log('email is ' + email);
        console.log('ctx.currentUser.email is ' + ctx.currentUser.email)
        setStatus("Error: You must enter the email address associated with this account before proceeding.");
        setTimeout(() => setStatus(""), 5000);
        return false;
      }
      return true;
    }
  
    function change(e) {
      setEmail(e.currentTarget.value);
      setButtonDisabled(!e.currentTarget.value);
    }
  
    function handle() {
      setStatus("");
      if (!validate(email)) return;

      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found.');
        setStatus("Authentication error.")
        return;
      }

      // See MDN documentation https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

      (async function deleteData() {
        //const requestBody = {email: ctx.currentUser.email, token: token}
        const info = {email: ctx.currentUser.email, token: token};
        const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:4000";
        const url = backendUrl + `/account/delete`;

        try {
            const response = await Axios.get(url, {params: info});
        
        //     if (!response.ok) {
        //     throw new Error (`Response status: ${response.status}`);
        //   }
        const data = await response.data;
        setData(data);
          if (data.valid) {
            localStorage.removeItem('token'); ///// ADDED FOR REMOVE FIREBASE
            setEmail("");
            ctx.currentUser = {name: "",
              email: "",
              password: "",
              balance: 0
            };
            setShow(false);

            loggedOutNavTabs.forEach(tab => document.getElementById(tab).style.display ='inline');
            userNavTabs.forEach(tab => document.getElementById(tab).style.display = 'none');
            document.getElementById('navbarDropdown').innerHTML = '';
            document.getElementById('all-data').style.display = 'none';
            // see authentication with Firebase lecture videos and https://firebase.google.com/docs/auth/web/manage-users#web_23

            // const auth = getAuth();
            // const user = auth.currentUser;

            // deleteUser(user).then(() => {
            //       console.log('Successfully deleted user from FireBase.');
            //   })
            //   .catch ( (error) => {
            //   console.error('Error code: ' + error.code); // error deleting user from Firebase
            //   console.error('Error message: ' + error.message); // error deleting user from Firebase
            //   });
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
          } else {
              setStatus(data.content); // "You must empty your account first!"
              setTimeout(() => setStatus(""), 5000);
          }
          console.log(data.content); // console log message from the server.
          }
          
         catch (error) {
          console.error(error.message); // error communicating with the server.
        }

      })();
    
    }

    function clearForm() {
      // Not necessary to sign out of Firebase because the firebase user is deleted when the first form is submitted. 

      // firebase.auth().signOut()
      // .then (() => {
      //   console.log('Successfully signed out of Firebase.');
      //   setShow(true);
      // })
      // .catch ( (error) => {
      //   console.error('Error code: ' + error.code); // error signing out of Firebase
      //   console.error('Error message: ' + error.message); // error signing out of Firebase
      // })
    }
  
    const inputFields = [
      {
        title: "Email",
        type: "input",
        id: "email",
        placeholder: "Enter your email address.",
        value: email,
      },
    ];
  
    const submitButtonLabels = ["Close Account", "Create a new account"];
  
    const formMessages = [`Hello, ${ctx.currentUser.name}. Enter your email and click the button to permanently close your account.`, "We're sorry to see you go"];
  
    const loggedOutNavTabs = ['create-account', 'login'];
    const userNavTabs = ['deposit', 'withdraw', 'username', 'balance', 'delete-account'];
    
      return (
      <>
        <Card
          bgcolor="dark"
          header="Close my account"
          text={
            ''
          }
          status={status}
          body={
            <>
                <Routes>
                <Route path="/CreateAccount" component={CreateAccount} />
                </Routes>
            <FormTemplate
              show={show}
              formMessages={formMessages}
              data={inputFields}
              onChange={change}
              disabled={buttonDisabled}
              onClick={handle}
              submitButtonLabels={submitButtonLabels}
              onClear={clearForm}
              href = "#/CreateAccount"
            />
            </>
          }
        />
      </>
    )
}

export default DeleteAccount;
