SELECT E.emp_id, E.emp_name, D.dept_id, D.dept_name
  FROM Employees E LEFT OUTER JOIN Departments D
    ON E.dept_id = D.dept_id
