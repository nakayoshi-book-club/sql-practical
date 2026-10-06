SELECT item_name, year, price_tax_ex AS price
  FROM Items
 WHERE year <= 2001
UNION
SELECT item_name, year, price_tax_in AS price
  FROM Items
 WHERE year >= 2002
