SELECT C.co_cd, C.district,
       SUM(emp_nbr) AS sum_emp
  FROM BigCompanies C
       INNER JOIN
         BigShops S
    ON C.co_cd = S.co_cd
 WHERE main_flg = 'Y'
 GROUP BY C.co_cd, C.district
