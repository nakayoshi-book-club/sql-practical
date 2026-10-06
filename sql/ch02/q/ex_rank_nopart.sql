SELECT name, sex, age,
       RANK() OVER(ORDER BY sex, age DESC) AS rnk
  FROM Address