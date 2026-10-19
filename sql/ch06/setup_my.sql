SET SESSION cte_max_recursion_depth = 200000;
CREATE TABLE Table_A (col_a INTEGER NOT NULL);
INSERT INTO Table_A
WITH RECURSIVE s(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM s WHERE n < 1000)
SELECT n FROM s;
INSERT INTO Shops
WITH RECURSIVE s(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM s WHERE n < 50)
SELECT lpad(n, 5, '0'), concat('店舗', lpad(n, 5, '0')),
       ELT(1 + (n - 1) % 10, '東京都','大阪府','北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県','福岡県')
  FROM s;
INSERT INTO Orders
WITH RECURSIVE s(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM s WHERE n < 100000)
SELECT n,
       CASE WHEN n <= 50000 THEN '00001' ELSE lpad(2 + floor((n - 50001) / 1021), 5, '0') END,
       DATE_ADD('2024-01-01', INTERVAL (n - 1) % 366 DAY),
       100 * (1 + n % 50)
  FROM s;
CREATE INDEX idx_orders_shop ON Orders (shop_id);
ANALYZE TABLE Employees, Departments, Digits, Table_A, Table_B, Table_C, Shops, Orders;
