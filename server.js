const inquirer = require("inquirer");
const fs = require("fs");
const res = require("express/lib/response");

// Import Express
const express = require("express");

// Import MYSQL
const mysql2 = require("mysql2");
const { start } = require("repl");

// Creating variable for local host PORT
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Conection to database
const db = mysql2.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // MySQL password
    password: "rootroot",
    database: "employee_db",
  },
  console.log(`Connected to the employee_db database.`)
);

// Main questions for entire prompt
const startApplication = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "start",
        message: "What would you like to do?",
        choices: [
          "View Employee Info",
          "Add Employee Info",
          "Update Employee Info",
          "Exit",
        ],
      },
    ])
    .then(function (res) {
      switch (res.start) {
        case "View Employee Info":
          viewEmp();
          break;
        case "Add Employee Info":
          addEmp();
          break;
        case "Update Employee Info":
          updateEmp();
          break;
        case "Exit":
          console.log("You have exited the application!");
          break;
      }
    });
};

// START OF VIEW FUNCTIONS
const viewEmp = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "viewTracking",
        message: "What would you like to view?",
        choices: ["View all employees", "View by Department", "View by Role"],
      },
    ])
    .then(function (res) {
      switch (res.viewTracking) {
        case "View All Employees":
          viewAllEmployees();
          break;
        case "View Employees by Department":
          viewAllByDepartment();
          break;
        case "View Employees by Role":
          viewAllByRole();
          break;
      }
    });
};

// Functions to QUERY View Funtions from Database
const viewAllEmployees = () => {
  db.query(
    "SELECT employee.id AS Id, employee.first_name AS First, employee.last_name AS Last FROM employee",
    function (err, results) {
      if (err) throw err;
      res.json(results);
      startApplication();
    }
  );
};

const viewAllByDepartment = () => {
  db.query("SELECT * FROM departments", function (err, results) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "viewAllByDepartmentList",
          type: "list",
          message: "Please select a department:",
          choices: function () {
            let depListArry = [];
            for (let i = 0; i < results.length; i++) {
              depListArry.push(results[i].name);
            }
            return depListArry;
          },
        },
      ])
      .then(function (value) {
        db.query(
          "SELECT * FROM departments",
          [value.viewAllByDepartment],
          function (err, results) {
            if (err) throw err;
            res.json(results);
            startApplication();
          }
        );
      });
  });
};

const viewAllByRole = () => {
  db.query("SELECT * FROM role", function (err, results) {
    if (err) throw err;
    res.json(results);
    startApplication();
  });
};

// GET from departments
// app.get("/api/departments", (req, res) => {
//   db.query("SELECT * FROM departments", function (err, results) {
//     res.json(results);
//   });
// });

// //GET from role
// app.get("/api/role", (req, res) => {
//   db.query("SELECT * FROM role", function (err, results) {
//     res.json(results);
//   });
// });

// // GET from employee
// app.get("/api/employee", (req, res) => {
//   db.query("SELECT * FROM employee", function (err, results) {
//     res.json(results);
//   });
// });

// Generates 404 error
app.use((req, res) => {
  res.status(404).end();
});

// Listening for localhost port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

startApplication();
