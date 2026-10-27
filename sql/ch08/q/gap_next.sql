SELECT num,
       MAX(num)
         OVER (ORDER BY num
                ROWS BETWEEN 1 FOLLOWING
                         AND 1 FOLLOWING) AS next_num
  FROM Numbers
