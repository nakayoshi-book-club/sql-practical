CREATE TABLE Table_A (col_a INTEGER NOT NULL);
INSERT INTO Table_A SELECT n FROM generate_series(1, 1000) AS n;
INSERT INTO Shops
SELECT lpad(n::text, 5, '0'), '店舗' || lpad(n::text, 5, '0'),
       (ARRAY['東京都','大阪府','北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県','福岡県'])[1 + (n - 1) % 10]
  FROM generate_series(1, 50) AS n;
INSERT INTO Orders
SELECT n,
       CASE WHEN n <= 50000 THEN '00001' ELSE lpad((2 + (n - 50001) / 1021)::text, 5, '0') END,
       DATE '2024-01-01' + (n - 1) % 366,
       100 * (1 + n % 50)
  FROM generate_series(1, 100000) AS n;
CREATE INDEX idx_orders_shop ON Orders (shop_id);
VACUUM ANALYZE;
