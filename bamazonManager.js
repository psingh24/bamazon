var mysql = require("mysql");
var inquirer = require("inquirer");
var config = require("./db.js");

var connection = mysql.createConnection(config.mySQLKeys);

connection.connect(function(err) {
  if (err) throw err;

  //   console.log("connected ad id "+ connection.threadId)
});

var products = [];
var LowProductQuantity = [];
function manager() {
  inquirer
    .prompt([
      {
        name: "route",
        message: "What would you like to do?",
        type: "list",
        choices: [
          "View Products for Sale",
          "Products with Low Inventory",
          "Add to Inventory",
          "Add New Product"
        ]
      }
    ])
    .then(function(answer) {
      if (answer.route === "View Products for Sale") {
        getProducts();
      } else if (answer.route === "Products with Low Inventory") {
        lowInventory();
      } else if (answer.route === "Add to Inventory") {
          addToInventory()
      } else if (answer.route === "Add New Product") {
      }
    });
}



function addToInventory() {
        connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

    for (var i = 0; i < res.length; i++) {
        products.push("Product:"+res[i].product_name+ ", Quantity: "+res[i].stock_quantity)
     }

     inquirer.prompt([
         {
             name: "addInventory",
             message: "Select Product to add Inventory",
             type: "list",
             choices: products
         },
         {
             name: "howMany",
             message: "How man would you lke to add?",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
                }
         }
     ]).then(function(answer) {
          
            var test = answer.addInventory.split(",")
            var Inventory;

            // var test2 = test.split(":") 
            var test2 = test[0].split(':')
            console.log(test2[1])
          var howMany = Number(answer.howMany)
          connection.query("SELECT * FROM products Where product_name?", [test2[1]], function(err, res) { 
              if (err) throw err;
               for (var i = 0; i < res.length; i++) {
                   Inventory = res[i].stock_quantity
               }
               var total = Inventory + howMany
            connection.query("Update products SET ? Where ?", [{
                stock_quantity: total
            },
            {
                product_name: test2[1]
            }], function(err, res) {
                if (err) throw err;
                console.log(res);
            });


          })

     })

  });
}









function lowInventory() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

    for (var i = 0; i < res.length; i++) {
      if (res[i].stock_quantity < 5) {
        console.log("hello");
        LowProductQuantity.push(
          "Product: " +
            res[i].product_name +
            " , Quantity: " +
            res[i].stock_quantity
        );
      }
    }
    if (LowProductQuantity.length !== 0) {
      console.log("These Items are low in quantity: \n");
      for (var i = 0; i < LowProductQuantity.length; i++) {
        console.log(LowProductQuantity[i]);
      }
    } else {
      console.log("Inventory looks good, everything is fully stocked!");
    }
  });
}

function getProducts() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

    for (var i = 0; i < res.length; i++) {
      products.push(res[i].product_name);
      if (res[i].stock_quantity < 5) {
        console.log("hello");
        LowProductQuantity.push(
          "Product: " +
            res[i].product_name +
            " , Quantity: " +
            res[i].stock_quantity
        );
        console.log(LowProductQuantity);
      }
    }
    // console.log(LowProductQuantity)
    // inquirer
    //   .prompt([
    //     {
    //       name: "products",
    //       message: "Click each product for more info.",
    //       type: "list",
    //       choices: products
    //     }
    //   ])
    //   .then(function(answer) {
    //     productInfo(answer.products);
    //   });
    // for (var i = 0; i <products.length; i++) {
    //     console.log([i]+"."+ products[i])
    // }
  });
}

manager();

function productInfo(item) {
  var price;
  var quantity;
  connection.query(
    "Select * From products Where product_name=?",
    [item],
    function(err, res) {
      if (err) throw err;
      //    console.log(res)
      // if (item === "Books") {
      for (var i = 0; i < res.length; i++) {
        price = res[i].price;
        quantity = res[i].stock_quantity;
      }
      inquirer
        .prompt([
          {
            name: "edit",
            message: "Click on Price or Inventory to change",
            type: "list",
            choices: ["Price: $" + price, "Inventory: " + quantity]
          }
        ])
        .then(function(answer) {
          if (answer.edit === "Price: $" + price) {
            changeTo(item, price);
          } else if ("Inventory: " + quantity) {
            changeTo(item, quantity);
          }
        });
    }
  );
}

function changeTo(item, route) {
  inquirer
    .prompt([
      {
        name: "changeTo",
        message: "What do you want to change it to?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
      if (route === price) {
        connection.query(
          "Update products SET ? Where ?",
          [
            {
              price: answer.changeTo
            },
            {
              product_name: item
            }
          ],
          function(err, res) {
            if (err) throw err;
          }
        );
      } else if (route === quantity) {
        connection.query(
          "Update products SET ? Where ?",
          [
            {
              stock_quantity: answer.changeTo
            },
            {
              product_name: item
            }
          ],
          function(err, res) {
            if (err) throw err;
          }
        );
      }
    });
}
