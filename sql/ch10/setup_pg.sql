CREATE TABLE Shops (shop_id CHAR(4) NOT NULL, shop_name VARCHAR(32) NOT NULL, CONSTRAINT pk_Shops PRIMARY KEY (shop_id));
INSERT INTO Shops
SELECT lpad(n::text, 4, '0'),
       CASE n WHEN 1 THEN '東京本店' WHEN 100 THEN '佐世保北店' WHEN 200 THEN '佐世保中央店' WHEN 300 THEN 'JR佐世保駅前店'
              ELSE '店舗' || lpad(n::text, 4, '0') END
  FROM generate_series(1, 901) AS n;

CREATE TABLE Orders
(order_id     CHAR(8) NOT NULL,
 shop_id      CHAR(4) NOT NULL,
 shop_name    VARCHAR(32) NOT NULL,
 receive_date DATE NOT NULL,
 process_flg  CHAR(1) NOT NULL,
 CONSTRAINT pk_Orders PRIMARY KEY(order_id));
INSERT INTO Orders
SELECT lpad(n::text, 8, '0'), S.shop_id, S.shop_name,
       DATE '2022-01-01' + ((n - 1) * 1461 / 1000000),
       CASE WHEN n > 980000 THEN '1' WHEN n > 930000 THEN '2' WHEN n > 880000 THEN '3' WHEN n > 830000 THEN '4' ELSE '5' END
  FROM generate_series(1, 1000000) AS n
       INNER JOIN Shops S
          ON S.shop_id = CASE WHEN n % 10 = 0 THEN '0001'
                              ELSE lpad((2 + ((n / 10) * 9 + n % 10 - 1) % 900)::text, 4, '0') END
 ORDER BY n;
CREATE INDEX idx_Orders_flg ON Orders (process_flg);
CREATE INDEX idx_Orders_shop ON Orders (shop_id);
CREATE INDEX idx_Orders_date ON Orders (receive_date, order_id);
CREATE INDEX idx_Orders_name ON Orders (shop_name varchar_pattern_ops);

CREATE TABLE SomeTable (id INTEGER NOT NULL, col_1 NUMERIC(8), col_2 VARCHAR(16) NOT NULL, col_3 CHAR(8) NOT NULL, CONSTRAINT pk_SomeTable PRIMARY KEY (id));
INSERT INTO SomeTable
SELECT n, CASE WHEN n % 10000 = 0 THEN NULL ELSE (n * 7919) % 100000 + 1 END,
       substr(md5(n::text), 1, CASE WHEN n % 1000 = 0 THEN 10 ELSE 8 END), lpad(n::text, 8, '0')
  FROM generate_series(1, 100000) AS n;
CREATE INDEX idx_SomeTable_1 ON SomeTable (col_1);
CREATE INDEX idx_SomeTable_2 ON SomeTable (col_2);
CREATE INDEX idx_SomeTable_3 ON SomeTable USING hash (col_3);
CREATE TABLE OrderMart (order_id CHAR(8) NOT NULL, receive_date DATE NOT NULL);
INSERT INTO OrderMart SELECT order_id, receive_date FROM Orders ORDER BY order_id;
CREATE TABLE ShopMonthMart (order_year INTEGER NOT NULL, order_month INTEGER NOT NULL, shop_id CHAR(4) NOT NULL, order_cnt INTEGER NOT NULL);
INSERT INTO ShopMonthMart
SELECT EXTRACT(YEAR FROM receive_date), EXTRACT(MONTH FROM receive_date), shop_id, COUNT(*)
  FROM Orders
 GROUP BY EXTRACT(YEAR FROM receive_date), EXTRACT(MONTH FROM receive_date), shop_id
 ORDER BY 1, 2, 3;
VACUUM ANALYZE;
