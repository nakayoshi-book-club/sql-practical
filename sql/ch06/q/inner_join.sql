SELECT E.emp_id, E.emp_name, E.dept_id, D.dept_name
  FROM Employees E INNER JOIN Departments D
    ON E.dept_id = D.dept_id
