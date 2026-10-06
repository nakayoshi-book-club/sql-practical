SELECT name, sex, age,
       DENSE_RANK() OVER(PARTITION BY sex
                         ORDER BY age DESC) AS rnk
  FROM Address