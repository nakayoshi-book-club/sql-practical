SELECT /*+ NO_INDEX(Orders idx_Orders_flg) */
       order_id, receive_date
  FROM Orders
 WHERE process_flg = '5'