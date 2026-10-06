SELECT name, sex, age,
       RANK() OVER(PARTITION BY sex
                   ORDER BY age) AS rnk
  FROM Address