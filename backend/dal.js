const { MongoClient } = require("mongodb");
 
// Replace the following with your Atlas connection string
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";

const client = new MongoClient(uri);

let db = null;
let customers = null;
let transactions = null;
                      
 async function run() {
    try {
        // Connect to the Atlas cluster
         await client.connect();
         // Get the database and collection on which to run the operation
         db = client.db("BadBank");
         customers = db.collection("customers");
         transactions = db.collection("transactions");
  
        } catch (err) {
         console.log(err.stack);
     }

}
run().catch(console.dir);

async function create(name, email, password) {
    const doc = { name, email, password, balance: 0 };
    try{

    const customerArray = await customers.find({ email }).toArray();
    if (customerArray.length === 0) {
      await customers.insertOne(doc);
      const newCustomer = await customers.find({ email }).toArray();
      console.log("Customer inserted", newCustomer[0]);
      return {valid: true, content: newCustomer[0]}
    } else {
      return ({valid: false, content: 'A customer with that email address already exists!'})
    }
    } catch (err) {
      console.log(err.stack);
    }
  }
  
  async function login(email, password) {
    try {

    const customerArray = await customers.find({ email, password }).toArray();
    if (customerArray.length === 0) {
    return {valid: false, content: 'The email address and password you have entered are incorrect.'}
    } else {
      const customer = customerArray[0];
      return ({valid: true, content: customer})
    }
  } catch (err) {
    console.log(err.stack);
  }
 
  }

  // async function logout() {
   
  //   await client.close();
    
  // }
  
  async function deposit(email, amount) {
    // updating customer's balance in the database
    try {

    const customerArray = await customers.find({ email }).toArray();
    if (customerArray.length === 0) {
      return {valid: false, content: 'There is no account associated with that email address.'}
    } else {
      const customer = customerArray[0];
      const previousBalance = Number(customer.balance);
      const newBalance = previousBalance + Number(amount);
  
      await customers.updateOne({email}, {$set: {balance: newBalance}});
      const updatedCustomerArray = await customers.find({ email }).toArray();
      const updatedCustomer = updatedCustomerArray[0];
      
      // updating transactions in the database
      const name = customer.name;
      const transaction = {name, type: 'deposit', amount, newBalance};
      await transactions.insertOne(transaction);
      return {valid: true, content: updatedCustomer};
    }
  } catch (err) {
    console.log(err.stack);
  }
 
  }
  
  async function withdraw(email, amount) {
    try {
 
    const customerArray = await customers.find({ email }).toArray();
    if (customerArray.length === 0) {
      return {valid: false, content: 'There is no account associated with that email address.'}
    } else {
      const customer = customerArray[0];
      const previousBalance = Number(customer.balance);
  
      if (Number(amount) <= previousBalance) {
        const newBalance = previousBalance - Number(amount);
  
        await customers.updateOne({email}, {$set: {balance: newBalance}});
        const updatedCustomerArray = await customers.find({ email }).toArray();
        const updatedCustomer = updatedCustomerArray[0];
      
        const name = customer.name;
        const transaction = {name, type: 'withdraw', amount, newBalance};
        await transactions.insertOne(transaction);
        return {valid: true, content: updatedCustomer}
      } else {
        return "You can't withdraw more money than you have in your account!"
      }
    }
  } catch (err) {
    console.log(err.stack);
  }
 
  }
  
  async function balance(email) {
    try {

    const customerArray = await customers.find({ email }).toArray();
    if (customerArray.length === 0) {
      return {valid: false, content: 'There is no account associated with that email address.'}
    } else {
      const customer = customerArray[0];
      console.log('the customer is' + JSON.stringify(customer));
      const currentBalance = Number(customer.balance);
      console.log('the current balance is $' + currentBalance);
      return({valid: true, name: customer.name, balance: currentBalance})
    };
  } catch (err) {
    console.log(err.stack);
  }

  }
  
  async function deleteAccount(email) {
    try { 
  
      const customerArray = await customers.find({ email }).toArray();
    if (customerArray.length === 0) {
      return {valid: false, content: 'There is no account associated with that email address.'}
    } else {
      const customer = customerArray[0];
      const balance = Number(customer.balance);
  
      if (balance === 0) {
        await customers.deleteOne({email});
        return {valid: true, content: "Success! Your account has been closed. We retain a record of your transaction history."}
      } else {
          return {valid: false, content: "You must empty your account first!"}
      }
    }
  } catch (err) {
    console.log(err.stack);
  }
 
  }
  
  async function allCustomers() {
    try {

      const findResult = await customers.find({}).toArray();
    console.log("Found documents =>", findResult);
    return findResult;
  } catch (err) {
    console.log(err.stack);
  }
  
  }
  
  async function allTransactions() {
    try {
  
      const findResult = await transactions.find({}).toArray();
    console.log("Found documents =>", findResult);
    return findResult;
  } catch (err) {
    console.log(err.stack);
  }
  
  }
  
  
  module.exports = { create, login, deposit, withdraw, balance, deleteAccount, allCustomers, allTransactions};
