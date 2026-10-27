CREATE TABLE Receipts (cust_id CHAR(1) NOT NULL, seq INTEGER NOT NULL, price INTEGER NOT NULL, PRIMARY KEY (cust_id, seq));
INSERT INTO Receipts VALUES
('A',1,500),('A',2,1000),('A',3,700),
('B',5,100),('B',6,5000),('B',7,300),('B',9,200),('B',12,1000),
('C',10,600),('C',20,100),('C',45,200),('C',70,50),
('D',3,2000);

CREATE TABLE Companies (co_cd CHAR(3) NOT NULL, district CHAR(1) NOT NULL, CONSTRAINT pk_companies PRIMARY KEY (co_cd));
INSERT INTO Companies VALUES ('001','A'),('002','B'),('003','C'),('004','D');

CREATE TABLE Shops (co_cd CHAR(3) NOT NULL, shop_id CHAR(3) NOT NULL, emp_nbr INTEGER NOT NULL, main_flg CHAR(1) NOT NULL, CONSTRAINT pk_shops PRIMARY KEY (co_cd, shop_id));
INSERT INTO Shops VALUES
('001','1',300,'Y'),('001','2',400,'N'),('001','3',250,'Y'),
('002','1',100,'Y'),('002','2',20,'N'),
('003','1',400,'Y'),('003','2',500,'Y'),('003','3',300,'N'),('003','4',200,'Y'),
('004','1',999,'Y');

CREATE TABLE BigCompanies (co_cd CHAR(4) NOT NULL, district CHAR(1) NOT NULL, CONSTRAINT pk_bigcompanies PRIMARY KEY (co_cd));
CREATE TABLE BigShops (co_cd CHAR(4) NOT NULL, shop_id INTEGER NOT NULL, emp_nbr INTEGER NOT NULL, main_flg CHAR(1) NOT NULL, CONSTRAINT pk_bigshops PRIMARY KEY (co_cd, shop_id));
