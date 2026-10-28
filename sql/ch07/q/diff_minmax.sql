SELECT cust_id, MIN(price) - MAX(price) AS diff
  FROM Receipts
 GROUP BY cust_id
