SELECT C.co_cd, C.district,
       SUM(emp_nbr) AS sum_emp
  FROM Companies C
       INNER JOIN
         Shops S
    ON C.co_cd = S.co_cd
 GROUP BY C.co_cd, C.district
