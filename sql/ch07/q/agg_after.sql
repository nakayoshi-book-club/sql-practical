SELECT C.co_cd, MAX(C.district),
       SUM(emp_nbr) AS sum_emp
  FROM Companies C
       INNER JOIN
         Shops S
    ON C.co_cd = S.co_cd
 WHERE main_flg = 'Y'
 GROUP BY C.co_cd
