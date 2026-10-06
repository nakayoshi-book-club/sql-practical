SET SESSION cte_max_recursion_depth = 100000;
CREATE TABLE Shops (shop_id CHAR(5) NOT NULL, shop_name VARCHAR(32) NOT NULL, rating INTEGER NOT NULL, area VARCHAR(16) NOT NULL, PRIMARY KEY (shop_id));
INSERT INTO Shops
WITH RECURSIVE s(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM s WHERE n < 50000)
SELECT lpad(n, 5, '0'), concat('商店', lpad(n, 5, '0')), 1 + (n * 7) % 5,
       ELT(1 + n % 10, '北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県','東京都','大阪府','福岡県')
  FROM s;
CREATE TABLE Reservations (reserve_id INTEGER NOT NULL, shop_id CHAR(5) NOT NULL, reserve_name VARCHAR(32) NOT NULL, PRIMARY KEY (reserve_id));
INSERT INTO Reservations
WITH RECURSIVE s(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM s WHERE n < 10)
SELECT n, lpad(n, 5, '0'), concat(char(64 + n), 'さん') FROM s;
DROP DATABASE IF EXISTS stale;
CREATE DATABASE stale;
CREATE TABLE stale.Shops LIKE Shops;
ALTER TABLE stale.Shops STATS_AUTO_RECALC = 0;
INSERT INTO stale.Shops SELECT * FROM Shops;
ANALYZE TABLE Shops, Reservations, stale.Shops;
DELETE FROM stale.Shops;
