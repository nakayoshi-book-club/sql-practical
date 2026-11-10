SELECT shop_id
  FROM Orders
 WHERE receive_date
        BETWEEN DATE '2025-12-01'
            AND DATE '2025-12-31'