var mysql = require("mysql");
var inquirer = require("inquirer");
var config = require("./db.js")

var connection = mysql.createConnection(config.mySQLKeys);

connection.connect(function(err) {
  if (err) throw err;

  // console.log("connected ad id "+ connection.threadId)
  bamazon();
});


var namePrice = [];
var cart;

function bamazon() {
  inquirer
    .prompt([
      {
        name: "department",
        message: "Welcome to Bamazon, Which Department would you like to shop in?",
        type: "list",
        choices: [
          "Electronics",
          "Books",
          "Movies & TV",
          "Home, Garden, Tools",
          "Clothing"
        ]
      }
    ])
    .then(function(answers) {
      if (answers.department === "Books") {
        getProducts(answers.department);
      } else if (answers.department === "Electronics") {
        getProducts(answers.department);
      } else if (answers.department === "Movies & TV") {
        getProducts(answers.department);
      } else if (answers.department === "Home, Garden, Tools") {
        getProducts(answers.department);
      } else if (answers.department === "Clothing") {
        getProducts(answers.department);
      }
    });
}



function getProducts(item) {

  connection.query(
    "Select * From products Where department_name=?", [item],
    function(err, res) {
      //      if (err) throw err;
      // if (item === "Books") {
      for (var i = 0; i < res.length; i++) {
        var output = res[i].product_name + "; Price:$" + res[i].price;
        // name = res[i].product_name
        namePrice.push(output);
      }
 
      inquirer
        .prompt([
          {
            name: "product",
            message: "What would you like to buy?",
            type: "list",
            choices: namePrice
          },
          {
            name: "quantity",
            message: "How many would you like to buy?",
            validate: function(value) {
              if (isNaN(value) === false) {
                return true;
              }
              return false;
            }
          }
        ])
        .then(function(answer) {
          var buyHowMany = answer.quantity;
          var product_sales;

          var name = answer.product.split(";");
        
          // var quanity;

          connection.query("SELECT * FROM products WHERE ?",[
              {
                product_name: name[0],

              }
            ],
            function(err, res) {
              if (err) throw err;
             
              for (var i = 0; i < res.length; i++) {
                var quanity = res[i].stock_quantity;
                product_sales = res[i].product_sales
              }

              var total = Number(quanity) - Number(buyHowMany);
              

              var Price = name[1].split("$");
              var purchaseAmount = Number(Price[1]);
              var productSale = Number(product_sales + (purchaseAmount * buyHowMany))
             

              if (total < 0) {
                console.log("Sorry not enough in storage");
                getProducts(name[0]);
          
              } else {
                connection.query(
                  "Update products SET ? Where ?",
                  [
                    {
                      stock_quantity: total,
                      product_sales: productSale
                    },
                    {
                      product_name: name[0]
                    }
                  ],
                  function(err, res) {
                    if (err) throw err;
                  }
                );
                console.log(
                  "Thank you, Your total is $" + purchaseAmount * buyHowMany
                );

                inquirer
                  .prompt([
                    {
                      name: "shopAgian",
                      message: "Would you like to continue shopping?",
                      type: "confirm"
                    }
                  ])
                  .then(function(answer) {
                    if (answer.shopAgian === true) {
                      namePrice = [];

                      bamazon();
                    } else {
                      console.log("Thank you, Please come back soon!");
                      connection.end()
                    }
                  });
              }
            }
          );
        });
    }
  );
}
