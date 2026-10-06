SELECT emp_name, MAX(team) AS team
  FROM Employees
 GROUP BY emp_name
HAVING COUNT(*) = 1
UNION
SELECT emp_name, '2つを兼務' AS team
  FROM Employees
 GROUP BY emp_name
HAVING COUNT(*) = 2
UNION
SELECT emp_name, '3つ以上を兼務' AS team
  FROM Employees
 GROUP BY emp_name
HAVING COUNT(*) >= 3
