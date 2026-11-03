SELECT O.order_id,
       MAX(O.order_name),
       MAX(ORC.delivery_date - O.order_date) AS max_diff_days
  FROM Orders O
       INNER JOIN OrderReceipts ORC
          ON O.order_id = ORC.order_id
 WHERE ORC.delivery_date - O.order_date >= 3
 GROUP BY O.order_id
