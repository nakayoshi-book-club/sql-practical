CREATE TABLE Shops (shop_id CHAR(5) NOT NULL, shop_name VARCHAR(32) NOT NULL, rating INTEGER NOT NULL, area VARCHAR(16) NOT NULL, CONSTRAINT pk_shops PRIMARY KEY (shop_id));
INSERT INTO Shops
SELECT lpad(n::text, 5, '0'), '商店' || lpad(n::text, 5, '0'), 1 + (n * 7) % 5,
       (ARRAY['北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県','東京都','大阪府','福岡県'])[1 + n % 10]
  FROM generate_series(1, 50000) AS n;
CREATE TABLE Reservations (reserve_id INTEGER NOT NULL, shop_id CHAR(5) NOT NULL, reserve_name VARCHAR(32) NOT NULL, CONSTRAINT pk_reservations PRIMARY KEY (reserve_id));
INSERT INTO Reservations SELECT n, lpad(n::text, 5, '0'), chr(64 + n) || 'さん' FROM generate_series(1, 10) AS n;
CREATE SCHEMA stale;
CREATE TABLE stale.Shops (LIKE Shops INCLUDING ALL) WITH (autovacuum_enabled = off);
INSERT INTO stale.Shops SELECT * FROM Shops;
VACUUM ANALYZE;
DELETE FROM stale.Shops;
