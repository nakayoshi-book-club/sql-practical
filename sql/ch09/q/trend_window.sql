INSERT INTO Stocks2
SELECT brand, sale_date, price,
       CASE SIGN(price -
                  MAX(price) OVER (PARTITION BY brand
                                       ORDER BY sale_date
                                   ROWS BETWEEN 1 PRECEDING
                                            AND 1 PRECEDING))
            WHEN -1 THEN '↓'
            WHEN 0 THEN '→'
            WHEN 1 THEN '↑'
            ELSE NULL
        END
  FROM Stocks S2
