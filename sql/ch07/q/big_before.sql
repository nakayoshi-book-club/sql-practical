SELECT C.co_cd, C.district, sum_emp
  FROM BigCompanies C
       INNER JOIN
         (SELECT co_cd,
                 SUM(emp_nbr) AS sum_emp
            FROM BigShops
           WHERE main_flg = 'Y'
           GROUP BY co_cd) CSUM
    ON C.co_cd = CSUM.co_cd
