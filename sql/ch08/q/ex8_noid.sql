SELECT AVG(weight) AS median
  FROM (SELECT weight,
               ROW_NUMBER() OVER (ORDER BY weight ASC) AS hi,
               ROW_NUMBER() OVER (ORDER BY weight DESC) AS lo
          FROM WeightsEx8) TMP
 WHERE hi IN (lo, lo + 1, lo - 1)
