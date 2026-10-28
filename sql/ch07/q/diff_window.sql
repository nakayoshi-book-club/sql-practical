SELECT cust_id,
       SUM(CASE WHEN min_seq = 1 THEN price ELSE 0 END)
         - SUM(CASE WHEN max_seq = 1 THEN price ELSE 0 END) AS diff
  FROM (SELECT cust_id, price,
               ROW_NUMBER() OVER (PARTITION BY cust_id
                                      ORDER BY seq) AS min_seq,
               ROW_NUMBER() OVER (PARTITION BY cust_id
                                      ORDER BY seq DESC) AS max_seq
          FROM Receipts) WORK
 WHERE WORK.min_seq = 1
    OR WORK.max_seq = 1
 GROUP BY cust_id
