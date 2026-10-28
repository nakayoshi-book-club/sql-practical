SELECT AVG(weight)
  FROM (SELECT W1.weight
          FROM Weights W1, Weights W2
         GROUP BY W1.weight
        HAVING SUM(CASE WHEN W2.weight >= W1.weight THEN 1 ELSE 0 END)
                 >= COUNT(*) / 2
           AND SUM(CASE WHEN W2.weight <= W1.weight THEN 1 ELSE 0 END)
                 >= COUNT(*) / 2) TMP
