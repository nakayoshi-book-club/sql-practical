SELECT SUBSTRING(name, 1, 1) AS label,
       COUNT(*)
  FROM Persons
 GROUP BY SUBSTRING(name, 1, 1)
