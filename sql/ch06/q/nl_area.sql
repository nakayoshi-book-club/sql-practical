SELECT S.shop_name, O.order_id, O.amount
  FROM Shops S INNER JOIN Orders O
    ON S.shop_id = O.shop_id
 WHERE S.area = '大阪府'
