SELECT cust_id, seq, price
  FROM (SELECT cust_id, seq, price,
               ROW_NUMBER()
                 OVER (PARTITION BY cust_id
                           ORDER BY seq) AS row_seq
          FROM Receipts) WORK
 WHERE WORK.row_seq = 1
