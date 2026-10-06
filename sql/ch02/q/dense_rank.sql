SELECT name, age,
       DENSE_RANK() OVER(ORDER BY age DESC) AS dense_rnk
  FROM Address