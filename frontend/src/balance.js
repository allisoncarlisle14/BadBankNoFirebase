import React from 'react';
import Card from './card';
import FormTemplate from './formtemplate';
import {UserContext} from './context';
import Axios from 'axios'

function Balance() {
    const [show, setShow] = React.useState(true);
    const [status, setStatus] = React.useState("");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [balance, setBalance] = React.useState(0);
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
  
      (async function getData () {
        const info = {email: email, token: token};
        //const requestBody = {email: email, token: token}
        const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:4000";
        const url = backendUrl + `/account/balance`;
  
        try {
            const response = await Axios.get(url, {params: info});

        //     if (!response.ok) {
        //     throw new Error (`Response status: ${response.status}`);
        //   }
          const data = await response.data;
          setData(data);
          if (data.valid) {
            console.log(data); // console log data
            setName(data.name);
            setBalance(data.balance);
            setShow(false);
          } else {
            setStatus(data.content); // think about a better naming convention for an error message than response on the back end? 
          }
  
        }
        catch (error) {
            console.error(error.message); // error authenticating with the server 
          }
      })();
    }
  
    function clearForm() {
      setEmail("");
      setShow(true);
    }
  
    const inputFields = [
      {
        title: "Email",
        type: "input",
        id: "email",
        placeholder: "Enter the email address for any account.",
        value: email,
      },
    ];
  
    const submitButtonLabels = ["Check Balance", "Refresh Form"];
  
    const formMessages = [
      `Hello, ${ctx.currentUser.name}. Your account balance is $${ctx.currentUser.balance}. You may check the balance of any account here.`,
      name + "'s account balance is $" + balance + ".",
    ];
  
  
    if (ctx.currentUser.email === 'fury@shield.org') {
      return (
        <>
          <Card
            bgcolor="info"
            txtcolor= "white"
            header="Balance"
            text={
              ''
            }
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
    )
    } else {
      return (
        <>
          <Card
            bgcolor="dark"
            header="Balance"
            text={
              `Hello, ${ctx.currentUser.name}. Your account balance is $${ctx.currentUser.balance}.`
            }
            status={status}
            body={
              ''
            }
          />
        </>
      )
    }
  }
  
  export default Balance;