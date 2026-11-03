SELECT O.order_id,
       MAX(O.order_name) AS order_name,
       MAX(O.order_date) AS order_date,
       COUNT(*) AS item_count
  FROM Orders O
       INNER JOIN OrderReceipts ORC
          ON O.order_id = ORC.order_id
 GROUP BY O.order_id
