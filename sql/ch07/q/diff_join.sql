SELECT TMP_MIN.cust_id,
       TMP_MIN.price - TMP_MAX.price AS diff
  FROM (SELECT R1.cust_id, R1.seq, R1.price
          FROM Receipts R1
               INNER JOIN
                 (SELECT cust_id, MIN(seq) AS min_seq
                    FROM Receipts
                   GROUP BY cust_id) R2
            ON R1.cust_id = R2.cust_id
           AND R1.seq = R2.min_seq) TMP_MIN
       INNER JOIN
       (SELECT R3.cust_id, R3.seq, R3.price
          FROM Receipts R3
               INNER JOIN
                 (SELECT cust_id, MAX(seq) AS max_seq
                    FROM Receipts
                   GROUP BY cust_id) R4
            ON R3.cust_id = R4.cust_id
           AND R3.seq = R4.max_seq) TMP_MAX
    ON TMP_MIN.cust_id = TMP_MAX.cust_id
