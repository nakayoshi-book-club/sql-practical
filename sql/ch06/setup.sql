CREATE TABLE Employees (emp_id CHAR(3) NOT NULL, emp_name VARCHAR(32) NOT NULL, dept_id CHAR(2), CONSTRAINT pk_emp PRIMARY KEY (emp_id));
INSERT INTO Employees VALUES
('001','石田','10'),('002','小笠原','11'),('003','夏目','11'),('004','米田','12'),('005','釜本','12'),('006','岩瀬','12');

CREATE TABLE Departments (dept_id CHAR(2) NOT NULL, dept_name VARCHAR(32) NOT NULL, CONSTRAINT pk_dep PRIMARY KEY (dept_id));
INSERT INTO Departments VALUES ('10','総務'),('11','人事'),('12','開発'),('13','営業');

CREATE TABLE Digits (digit INTEGER NOT NULL, PRIMARY KEY (digit));
INSERT INTO Digits VALUES (0),(1),(2),(3),(4),(5),(6),(7),(8),(9);

CREATE TABLE Table_B (col_b INTEGER NOT NULL, PRIMARY KEY (col_b));
INSERT INTO Table_B VALUES (1),(2),(3);

CREATE TABLE Table_C (col_c INTEGER NOT NULL, PRIMARY KEY (col_c));
INSERT INTO Table_C VALUES (2),(3),(4);

CREATE TABLE Shops (shop_id CHAR(5) NOT NULL, shop_name VARCHAR(32) NOT NULL, area VARCHAR(16) NOT NULL, CONSTRAINT pk_shops PRIMARY KEY (shop_id));

CREATE TABLE Orders (order_id INTEGER NOT NULL, shop_id CHAR(5) NOT NULL, order_date DATE NOT NULL, amount INTEGER NOT NULL, CONSTRAINT pk_orders PRIMARY KEY (order_id));
