SELECT /*+ NO_INDEX(Orders idx_Orders_shop) */ *
  FROM Orders
 WHERE shop_id = '0001'