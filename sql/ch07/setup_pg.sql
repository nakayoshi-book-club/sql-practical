INSERT INTO BigCompanies
SELECT lpad(n::text, 4, '0'), chr(65 + (n - 1) % 26)
  FROM generate_series(1, 1000) AS n;
INSERT INTO BigShops
SELECT lpad((1 + (n - 1) / 100)::text, 4, '0'), 1 + (n - 1) % 100, 10 + n % 90,
       CASE WHEN n % 2 = 0 THEN 'Y' ELSE 'N' END
  FROM generate_series(1, 100000) AS n;
VACUUM ANALYZE;
