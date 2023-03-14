const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const moment = require("moment");
router.use(bodyParser.urlencoded({ extended: true }));
const Expense = require("../model/Expense");

//http://localhost:3000/expenses/
router.get("/expenses", (req, res) => {
  viewExpenses(res);
});

//http://localhost:3000/expenses/
router.post("/expenses", (req, res) => {
  viewAddedExpense(req,res)
});

//http://localhost:3000/update/
router.put("/update", async (req, res) => {
  const group1 = req.body.group1;
  const group2 = req.body.group2;
  changeExpenseGroup(group1, group2, res);
});

//http://localhost:3000/expenses/food?total=true
router.get("/expenses/:group", (req, res) => {
  const group = req.params.group;
  const total = req.query.total;

  if (total === "true") {
    viewGroupTotalAmounts(group,res)
  }
  else{
    viewExpenseByGroup(group,res)
  }
});

router.get("/expense", async (req, res) => {
  const d1 = req.query.d1;
  const d2 = req.query.d2;
  if (d1 && d2) {
    const start = moment(d1, "YYYY-MM-DD");
    const end = moment(d2, "YYYY-MM-DD");
    viewExpensesByDates(start, end, res);
  } else if (d1) {
    const start = moment(d1, "YYYY-MM-DD");
    const end = moment();
    viewExpensesByDates(start, end, res);
  } else {
    viewExpenses(res);
  }
});

const expensesByRangeDates = async function (start, end) {
  const expenses = await Expense.find({ date: { $gte: start, $lte: end } });
  return expenses;
};

const getExpenses = async function () {
  const expenses = await Expense.find({});
  return expenses;
};

const initExpense = function (expense) {
  return new Expense(expense).save();
};

const getExpensesByGroup = async function (group1) {
  const expenses = await Expense.find({ group: group1 });
  return expenses;
};

const viewExpensesByDates = function (start, end, res) {
  expensesByRangeDates(start, end).then((err, expenses) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(expenses);
    }
  });
};

const viewExpenses = function (res) {
  getExpenses().then((err, expenses) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(expenses);
    }
  });
};

const changeExpenseGroup = function (group1, group2, res) {
  getExpensesByGroup(group1).then((expense, err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      expense.group = group2;
      res.send(`Expense with group "${group1}" has been changed to group "${group2}"`);
    }
  });
};

const viewExpenseByGroup = function (group,res) {
  getExpensesByGroup(group).then((expense, err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(expense)
    }
  });
};

const viewAddedExpense = function (req, res) {
  const newExpense = initExpense(req.body);
  newExpense.then(function (expense) {
    console.log(
      `The amount of expense is ${expense.amount}\n and you spent your money on ${expense.group}`
    );
    res.send(`New expense was inserted -> ${expense}`);
  });
};

const sumOfAmountsSpecificGroup = function(expenses){
  let sum = 0;
  expenses.forEach(expense => sum += expense.amount);

  return sum
}

const viewGroupTotalAmounts = function(group,res){
  getExpensesByGroup(group).then((expenses, err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      totalAmount = sumOfAmountsSpecificGroup(expenses)
      res.send({group:group,total:totalAmount});
    }
  });
}
module.exports = router;
