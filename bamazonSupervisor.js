var mysql = require("mysql");
var inquirer = require("inquirer");
var config = require("./db.js");
var Table = require("cli-table2");

var connection = mysql.createConnection(config.mySQLKeys);

connection.connect(function(err) {
  if (err) throw err;

  //   console.log("connected ad id "+ connection.threadId)
  superVisor();
});

function superVisor() {
  inquirer
    .prompt([
      {
        name: "route",
        message: "What would you like to do?",
        type: "list",
        choices: ["View Product Sales by Department", "Create New Department"]
      }
    ])
    .then(function(answer) {
      if (answer.route === "View Product Sales by Department") {
        viewProducts();
      } else if (answer.route) {
        createNewDepartment();
      }
    });
}

function viewProducts() {
  var query = "SELECT d.department_id, d.department_name, d.over_head_costs, SUM(p.product_sales) as ProductSales, ";
  query+= "SUM(p.product_sales) - d.over_head_costs AS total_profit ";
  query+= "FROM products as p ";
  query+= "INNER JOIN department as d ON p.department_name=d.department_name ";
  query+= "group by d.department_name ";
  query+= "order by d.department_id";
  connection.query(query,
    function(err, res) {
      if (err) throw err;
      // console.log(res)
      var table = new Table({
        head: [
          "Department ID",
          "Department Name",
          "Over Head Costs",
          "Product Sales",
          "Total Profits"
        ],
        style: {
          head: [], //disable colors in header cells
          border: [] //disable colors for the border
        },
        colWidths: [17, 25, 19, 20] //set the widths of each column (optional)
      });

      for (var i = 0; i < res.length; i++) {
        table.push([
          res[i].department_id,
          res[i].department_name,
          res[i].over_head_costs,
          res[i].ProductSales,
          res[i].total_profit
        ]);
      }

      console.log(table.toString());
    }
  );

  setTimeout(superVisor, 3000);
}

function createNewDepartment() {
  inquirer
    .prompt([
      {
        name: "new",
        message: "What would you like to name the new department?"
      },
      {
        name: "costs",
        message: "How much over head costs are associated with this department?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "item",
        message: "What product would you like to sell in this department?"
      }
    ])
    .then(function(answers) {
      var departmentName = answers.new;
      var costs = Number(answers.costs);
      var item = answers.item;
      connection.query(
        "INSERT INTO department SET ?",
        [
          {
            department_name: departmentName,
            over_head_costs: costs
          }
        ],
        function(err, res) {
          console.log(
            "You have added " +
              departmentName +
              " as a new department with costs equal to $" +
              costs
          );
          setTimeout(addMore, 1000);
        }
      );
      connection.query(
        "INSERT INTO products SET ?",
        [
          {
            product_name: item,
            department_name: departmentName
          }
        ],
        function(err, res) {}
      );
    });
}

function addMore() {
  inquirer
    .prompt([
      {
        name: "addMore",
        message: "Would you like to add another department or return to the main menu?",
        type: "list",
        choices: ["Main Menu", "Add More Departments"]
      }
    ])
    .then(function(answer) {
      if (answer.addMore === "Main Menu") {
        superVisor();
      } else if (answer.addMore === "Add More Departments") {
        createNewDepartment();
      }
    });
}
