SELECT *
  FROM Orders
 WHERE EXTRACT(YEAR FROM
               receive_date) = 2025
   AND EXTRACT(MONTH FROM
               receive_date) = 12