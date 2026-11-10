SELECT *
  FROM Orders
 WHERE SUBSTRING(shop_name, 1, 3)
         = '佐世保'