SELECT address, COUNT(*)
  FROM Address
 WHERE COUNT(*) = 1
 GROUP BY address