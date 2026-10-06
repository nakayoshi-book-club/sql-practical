SELECT emp_name,
       CASE WHEN COUNT(*) = 1  THEN MAX(team)
            WHEN COUNT(*) = 2  THEN '2つを兼務'
            WHEN COUNT(*) >= 3 THEN '3つ以上を兼務'
        END AS team
  FROM Employees
 WHERE COUNT(*) >= 1
 GROUP BY emp_name
