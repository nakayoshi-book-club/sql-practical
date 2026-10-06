SELECT address, COUNT(*)
  FROM Address
 GROUP BY address
HAVING COUNT(*) = 1