const mongoose = require("mongoose");


mongoose.connect('mongodb://localhost/expenses')
.then(()=> console.log('Connected to MongoDB'))
.catch((error)=> console.log('cant Connected to MongoDB',error));


const expenseSchema = new mongoose.Schema({
    item: String,
    amount: Number,
    date: Date,
    group: String,
  });
  
  const Expense = mongoose.model('Expense', expenseSchema);
  module.exports = Expense



  
  



