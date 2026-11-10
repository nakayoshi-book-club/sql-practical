SELECT *
  FROM Orders
 WHERE CAST(receive_date AS CHAR(10))
         LIKE '2025-12%'