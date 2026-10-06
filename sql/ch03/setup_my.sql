SET SESSION cte_max_recursion_depth = 400000;
INSERT INTO ThreeElements
WITH RECURSIVE s(n) AS (SELECT 1000 UNION ALL SELECT n + 1 FROM s WHERE n < 300999)
SELECT n, 'x',
  CASE WHEN n % 3 = 0 THEN DATE '2000-01-01' + INTERVAL (n % 3650) DAY END, CASE WHEN n % 3 = 0 THEN IF(n % 2 = 0,'T','F') END,
  CASE WHEN n % 3 = 1 THEN DATE '2000-01-01' + INTERVAL (n % 3650) DAY END, CASE WHEN n % 3 = 1 THEN IF(n % 2 = 0,'T','F') END,
  CASE WHEN n % 3 = 2 THEN DATE '2000-01-01' + INTERVAL (n % 3650) DAY END, CASE WHEN n % 3 = 2 THEN IF(n % 2 = 0,'T','F') END
FROM s;
ANALYZE TABLE Items, Population, CustomerCount, Employees, ThreeElements;
