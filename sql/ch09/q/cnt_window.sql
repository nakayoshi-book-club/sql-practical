SELECT DISTINCT O.order_id, O.order_name, O.order_date,
       COUNT(*) OVER (PARTITION BY O.order_id) AS item_count
  FROM Orders O
       INNER JOIN OrderReceipts ORC
          ON O.order_id = ORC.order_id
