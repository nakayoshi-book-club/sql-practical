SELECT SUBSTRING(name, 1, 1) AS label,
       COUNT(*) OVER(PARTITION BY SUBSTRING(name, 1, 1)) AS count
  FROM Persons
