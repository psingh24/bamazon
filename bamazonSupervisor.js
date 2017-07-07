var mysql = require("mysql");
var inquirer = require("inquirer");
var config = require("./db.js")

var connection = mysql.createConnection(config.mySQLKeys);

connection.connect(function(err) {
  if (err) throw err;

//   console.log("connected ad id "+ connection.threadId)
superVisor()
});

function superVisor() {
    inquirer.prompt([
        {
            name: "route",
            message: "What would you like to do?",
            type: "list",
            choices: ["View Product Sales by Department", "Create New Department"]
        }
    ]).then(function(answer) {
        console.log(answer)
    })
}