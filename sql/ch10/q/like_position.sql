SELECT *
  FROM Orders
 WHERE POSITION('佐世保'
                IN shop_name) = 1