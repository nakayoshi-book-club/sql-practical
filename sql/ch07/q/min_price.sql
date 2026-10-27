SELECT cust_id, MIN(seq) AS seq, MIN(price) AS price
  FROM Receipts
 GROUP BY cust_id
