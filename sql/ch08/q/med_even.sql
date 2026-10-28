SELECT AVG(weight)
  FROM (SELECT weight,
               ROW_NUMBER() OVER (ORDER BY weight ASC, student_id ASC) AS hi,
               ROW_NUMBER() OVER (ORDER BY weight DESC, student_id DESC) AS lo
          FROM WeightsEven) TMP
 WHERE hi IN (lo, lo + 1, lo - 1)
