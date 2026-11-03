INSERT INTO Stocks2
SELECT brand, sale_date, price,
       CASE SIGN(price -
                  (SELECT price
                     FROM Stocks S1
                    WHERE brand = Stocks.brand
                      AND sale_date =
                           (SELECT MAX(sale_date)
                              FROM Stocks S2
                             WHERE brand = Stocks.brand
                               AND sale_date < Stocks.sale_date)))
            WHEN -1 THEN '↓'
            WHEN 0 THEN '→'
            WHEN 1 THEN '↑'
            ELSE NULL
        END
  FROM Stocks
