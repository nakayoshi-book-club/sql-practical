SELECT item_name, year, price_tax_ex AS price
  FROM Items
 WHERE year <= 2001 OR year >= 2002
