SELECT EXTRACT(YEAR FROM receive_date)
         AS order_year,
       EXTRACT(MONTH FROM receive_date)
         AS order_month,
       shop_id,
       COUNT(*) AS order_cnt
  FROM Orders
 GROUP BY EXTRACT(YEAR FROM receive_date),
          EXTRACT(MONTH FROM receive_date),
          shop_id