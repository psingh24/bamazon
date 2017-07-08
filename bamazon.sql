CREATE DATABASE bamazon;

USE bamazon;


CREATE TABLE products (

		id integer(11) NOT NULL AUTO_INCREMENT,
		product_name varchar(30) NOT NULL,
		department_name varchar(30) NOT NULL,
		price integer(30) NOT NULL,
        stock_quantity INTEGER(11) NOT NULL,
        product_sales integer(30) NOT NULL,
		PRIMARY KEY (`id`)

);

CREATE TABLE department (

		department_id  integer(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
		department_name varchar(30) NOT NULL,
		over_head_costs integer(30) NOT NULL

);

-- Insert dummy data
Insert Into department (department_name, over_head_costs)
Values ("Electronics", 60000), ("Books", 10000), ("Movies & TV", 20000), ("Home, Garden, Tools", 30000), ("Clothing", 15000);



-- Insert dummy data
INSERT INTO products (product_name, department_name, price, stock_quantity)
Values ("PS4", "electronic", 299, 100), ("Harry Potter Collections", "books", 75, 50), ("The Office The Complete Series ", "movies & tv", 45, 75),
("Sofa", "home, garden, tools", 399, 10), ("Bamazon Firestick", "electronic", 90, 100), ("Laptop", "electronic", 800, 50),
("Shirt", "clothing", 45, 100), ("Javascript for Dummies", "books", 20, 10), ("Primer", "movies & tv", 20, 10), ("Fridge", "home, garden, tools", 600, 10);
    
	
	
-- Create supervisor table using inner join and alias
SELECT d.department_id, d.department_name, d.over_head_costs, SUM(p.product_sales) as ProductSales, d.over_head_costs - SUM(p.product_sales) AS total_profit
FROM products as p
INNER JOIN department as d ON p.department_name=d.department_name
group by d.department_name
Order by d.department_id;