// Import Express
const express = require("express");

// Import MYSQL
const mysql2 = require("mysql2");

// Creating variable for local host PORT
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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

// Select from database
db.query("SELECT * FROM department", function (err, results) {
  console.log(results);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
