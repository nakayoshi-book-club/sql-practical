SELECT AVG(weight)
  FROM (SELECT weight,
               2 * ROW_NUMBER() OVER (ORDER BY weight)
                 - COUNT(*) OVER () AS diff
          FROM Weights) TMP
 WHERE diff BETWEEN 0 AND 2
