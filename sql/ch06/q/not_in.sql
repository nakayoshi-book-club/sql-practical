SELECT dept_id, dept_name
  FROM Departments D
 WHERE dept_id NOT IN (SELECT dept_id
                         FROM Employees E)
