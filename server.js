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

db.connect(function (err) {
  if (err) throw err;
  console.log("SQL connected");
});

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
          viewing();
          break;
        case "Add Employee Info":
          adding();
          break;
        case "Update Employee Info":
          updating();
          break;
        case "Exit":
          console.log("You have exited the application!");
          break;
      }
    });
};

// START OF VIEW FUNCTIONS
const viewing = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "viewTracking",
        message: "Where would you like to view from?",
        choices: [
          "View All Employees",
          "View Employees by Department",
          "View Employees by Role",
        ],
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
  db.query("SELECT * FROM employee", function (err, results) {
    if (err) throw err;
    console.table(results);
    startApplication();
  });
};

// View Employee by Dept Function
const viewAllByDepartment = () => {
  db.query("SELECT * FROM departments", function (err, results) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "depList",
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
          [value.depList],
          function (err, results) {
            if (err) throw err;
            console.table(results);
            startApplication();
          }
        );
      });
  });
};

const viewAllByRole = () => {
  db.query("SELECT * FROM role", function (err, results) {
    if (err) throw err;
    console.table(results);
    startApplication();
  });
};

// START OF ADD FUNCTIONS
const adding = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "addTracking",
        message: "Where would you like to information add to?",
        choices: ["Add Employee", "Add Department", "Add Role"],
      },
    ])
    .then(function (res) {
      switch (res.addTracking) {
        case "Add Employee":
          addEmployee();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Add Role":
          addRole();
          break;
      }
    });
};

// Function to Add Employee to Database
const addEmployee = () => {
  db.query("SELECT * FROM role", function (err, results) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "input",
          name: "addEmpFirst",
          message: "Please add the employees first name:",
        },
        {
          type: "input",
          name: "addEmpLast",
          message: "Please add the employees Last name:",
        },
        {
          name: "role",
          type: "rawlist",
          message: "Please select a role:",
          choices: function () {
            let roleListArry = [];
            for (let i = 0; i < results.length; i++) {
              roleListArry.push(results[i].title);
            }
            return roleListArry;
          },
          message: "Select a title",
        },
        {
          name: "manager",
          type: "number",
          validate: function (value) {
            if (isNaN(value) === false) {
              return true;
            } else {
              return false;
            }
          },
          message: "Enter Manager Id:",
          default: "1",
        },
      ])
      .then(function (value) {
        db.query("INSERT INTO employee SET ?", {
          first_name: value.addEmpFirst,
          last_name: value.addEmpLast,
          manager_id: value.manager,
        });
        console.log("You have successfully added a new employee");
      });
  });
};

// Function to Add Department to Database
const addDepartment = () => {
  inquirer
    .prompt([
      {
        name: "addDept",
        type: "input",
        message: "What is the name of the Department you would like to add?",
      },
    ])
    .then(function (value) {
      db.query(
        "INSERT INTO departments VALUES (DEFAULT, ?)",
        [value.addDept],
        function (err) {
          if (err) throw err;
          console.log("You have successfully submitted: " + value.addDept);
          startApplication();
        }
      );
    });
};

// Function to Add Role to Database
const addRole = () => {
  inquirer
    .prompt([
      {
        name: "roleTitle",
        type: "input",
        message: "What is the title of the role you would like to add?",
      },
      {
        name: "salary",
        type: "number",
        message: "What is the salary amount?",
      },
      {
        name: "departments_id",
        type: "number",
        message: "Please enter the department id:",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          } else {
            return false;
          }
        },
      },
    ])
    .then(function (value) {
      db.query(
        "INSERT INTO role SET ?",
        {
          title: value.roleTitle,
          salary: value.salary,
          departments_id: value.departments_id,
        },
        function (err) {
          if (err) throw err;
          console.log("You have successfully submitted: " + value.roleTitle);
          startApplication();
        }
      );
    });
};

// Generates 404 error
app.use((req, res) => {
  res.status(404).end();
});

// Listening for localhost port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

startApplication();
