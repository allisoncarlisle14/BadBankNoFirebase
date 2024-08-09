var express = require("express");
const app = express();
var cors = require("cors");
var dal = require("./dal.js");
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const { generateToken, verifyToken } = require("./utils/jwt.js");


app.use(cors());

// create account
app.get("/account/create", async function (req, res) {
  const response = await dal.create(
    req.query.name,
    req.query.email,
    req.query.password
  );

  // Generating a Json Web Token using the customer's id in the database
  if (response.valid) {
    const token = generateToken({ ID: response.content._id });
    response.token = token;
  } 
  // res.send(response);
  res.json(response);
});

// login
app.get("/account/login", async function (req, res) {
  const response = await dal.login(req.query.email, req.query.password);
  console.log('parameters are ' + req.query.email, req.query.password)
  console.log('database responded with' + JSON.stringify(response));

  // Generating a Json Web Token using the customer's id in the database
  if (response.valid) {
    const token = generateToken({ ID: response.content._id });
    response.token = token;
  }
  // res.send(response);
  res.json(response);
});

// logout
// app.get("/account/logout", async function (req, res) {
//   await dal.logout();
//   console.log('Successfully disconnected from MongoDB');
// });

// deposit
app.get("/account/deposit", async function (req, res) {

  const { email, amount, token } = req.query;

  // Checking for JWT authentication
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: no token" });
  }
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized: incorrect token" });
  }
  req.user = decoded;

  const response = await dal.deposit(email, amount);
  console.log(response); // console log response 
  res.send(response);
});

// withdraw
app.get("/account/withdraw", async function (req, res) {
  const { email, amount, token } = req.query;

  // Checking for JWT authentication
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: no token" });
  }
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized: incorrect token" });
  }
  req.user = decoded;

  const response = await dal.withdraw(email, amount);
  console.log(response); // console log response 
  res.send(response);
});

// balance
app.get("/account/balance", async function (req, res) {
  const { email, token } = req.query;

  // Checking for JWT authentication
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: no token" });
  }
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized: incorrect token" });
  }
  req.user = decoded;

  const response = await dal.balance(email);
  console.log(response); // console log response 
  res.send(response);
});

// delete account
app.get("/account/delete", async function (req, res) {
  const { email, token } = req.query;

  // Checking for JWT authentication
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: no token" });
  }
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized: incorrect token" });
  }
  req.user = decoded;

  const response = await dal.deleteAccount(email);
  console.log(response); // console log response 
  res.send(response);
});

// all customers
app.get("/account/all", async function (req, res) {
  const token = req.query.token;

  // Checking for JWT authentication
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: no token" });
  }
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized: incorrect token" });
  }
  req.user = decoded;

  console.log("attempting to get all user data");
  const customers = await dal.allCustomers();
  console.log("Data sent to client", customers); // console log customer data 
  res.send(customers);
 
});

// all transactions
app.get("/transactions/all", async function (req, res) {
  const token = req.query.token;

  // Checking for JWT authentication
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: no token" });
  }
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized: incorrect token" });
  }
  req.user = decoded;

  console.log("attempting to get all transaction data");
  const transactions = await dal.allTransactions();
  console.log("Data sent to client", transactions); // console log transaction data
  res.send(transactions);

});


let port = process.env.PORT;
if(port == null || port == "") {
 port = 4000;
}
app.listen(port, function() {
  console.log("Server started successfully");
 });
