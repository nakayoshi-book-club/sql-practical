SELECT name, sex, age,
       RANK() OVER(PARTITION BY sex
                   ORDER BY age DESC) AS rnk
  FROM Address