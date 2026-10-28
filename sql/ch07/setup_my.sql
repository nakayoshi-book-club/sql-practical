SET SESSION cte_max_recursion_depth = 200000;
INSERT INTO BigCompanies
WITH RECURSIVE s(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM s WHERE n < 1000)
SELECT lpad(n, 4, '0'), CHAR(65 + (n - 1) % 26) FROM s;
INSERT INTO BigShops
WITH RECURSIVE s(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM s WHERE n < 100000)
SELECT lpad(1 + floor((n - 1) / 100), 4, '0'), 1 + (n - 1) % 100, 10 + n % 90,
       CASE WHEN n % 2 = 0 THEN 'Y' ELSE 'N' END
  FROM s;
ANALYZE TABLE Receipts, Companies, Shops, BigCompanies, BigShops;
