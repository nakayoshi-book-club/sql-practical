SELECT dept_id, dept_name
  FROM Departments D
 WHERE EXISTS (SELECT *
                 FROM Employees E
                WHERE E.dept_id = D.dept_id)
