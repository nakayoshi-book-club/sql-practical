SELECT name, age,
       RANK() OVER(ORDER BY age DESC) AS rnk
  FROM Address