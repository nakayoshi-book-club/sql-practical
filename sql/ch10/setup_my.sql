CREATE TABLE Digits (d INTEGER NOT NULL PRIMARY KEY);
INSERT INTO Digits VALUES (0),(1),(2),(3),(4),(5),(6),(7),(8),(9);
CREATE TABLE Nums (n INTEGER NOT NULL PRIMARY KEY);
INSERT INTO Nums
SELECT 1 + D1.d + D2.d * 10 + D3.d * 100 + D4.d * 1000 + D5.d * 10000 + D6.d * 100000
  FROM Digits D1, Digits D2, Digits D3, Digits D4, Digits D5, Digits D6;

CREATE TABLE Shops (shop_id CHAR(4) NOT NULL, shop_name VARCHAR(32) NOT NULL, PRIMARY KEY (shop_id));
INSERT INTO Shops
SELECT lpad(n, 4, '0'),
       CASE n WHEN 1 THEN '東京本店' WHEN 100 THEN '佐世保北店' WHEN 200 THEN '佐世保中央店' WHEN 300 THEN 'JR佐世保駅前店'
              ELSE concat('店舗', lpad(n, 4, '0')) END
  FROM Nums WHERE n <= 901;

CREATE TABLE Orders
(order_id     CHAR(8) NOT NULL,
 shop_id      CHAR(4) NOT NULL,
 shop_name    VARCHAR(32) NOT NULL,
 receive_date DATE NOT NULL,
 process_flg  CHAR(1) NOT NULL,
 PRIMARY KEY(order_id));
INSERT INTO Orders
SELECT lpad(N.n, 8, '0'), S.shop_id, S.shop_name,
       DATE_ADD('2022-01-01', INTERVAL (N.n - 1) * 1461 DIV 1000000 DAY),
       CASE WHEN N.n > 980000 THEN '1' WHEN N.n > 930000 THEN '2' WHEN N.n > 880000 THEN '3' WHEN N.n > 830000 THEN '4' ELSE '5' END
  FROM Nums N
       INNER JOIN Shops S
          ON S.shop_id = CASE WHEN N.n % 10 = 0 THEN '0001'
                              ELSE lpad(2 + ((N.n DIV 10) * 9 + N.n % 10 - 1) % 900, 4, '0') END
 ORDER BY N.n;
CREATE INDEX idx_Orders_flg ON Orders (process_flg);
CREATE INDEX idx_Orders_shop ON Orders (shop_id);
CREATE INDEX idx_Orders_date ON Orders (receive_date, order_id);
CREATE INDEX idx_Orders_name ON Orders (shop_name);

CREATE TABLE SomeTable (id INTEGER NOT NULL, col_1 DECIMAL(8), col_2 VARCHAR(16) NOT NULL, col_3 CHAR(8) NOT NULL, PRIMARY KEY (id));
INSERT INTO SomeTable
SELECT n, CASE WHEN n % 10000 = 0 THEN NULL ELSE (n * 7919) % 100000 + 1 END,
       substr(md5(n), 1, CASE WHEN n % 1000 = 0 THEN 10 ELSE 8 END), lpad(n, 8, '0')
  FROM Nums WHERE n <= 100000;
CREATE INDEX idx_SomeTable_1 ON SomeTable (col_1);
CREATE INDEX idx_SomeTable_2 ON SomeTable (col_2);
CREATE INDEX idx_SomeTable_3 USING HASH ON SomeTable (col_3);
CREATE TABLE OrderMart (order_id CHAR(8) NOT NULL, receive_date DATE NOT NULL);
INSERT INTO OrderMart SELECT order_id, receive_date FROM Orders ORDER BY order_id;
CREATE TABLE ShopMonthMart (order_year INTEGER NOT NULL, order_month INTEGER NOT NULL, shop_id CHAR(4) NOT NULL, order_cnt INTEGER NOT NULL);
INSERT INTO ShopMonthMart
SELECT EXTRACT(YEAR FROM receive_date), EXTRACT(MONTH FROM receive_date), shop_id, COUNT(*)
  FROM Orders
 GROUP BY EXTRACT(YEAR FROM receive_date), EXTRACT(MONTH FROM receive_date), shop_id
 ORDER BY 1, 2, 3;
DROP TABLE Digits, Nums;
ANALYZE TABLE Shops, Orders, SomeTable, OrderMart, ShopMonthMart;
