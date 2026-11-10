SELECT *
  FROM Orders
 WHERE receive_date
         + INTERVAL '1' DAY
        BETWEEN DATE '2025-12-02'
            AND DATE '2026-01-01'