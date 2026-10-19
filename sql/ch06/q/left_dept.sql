SELECT E.emp_id, E.emp_name, D.dept_id, D.dept_name
  FROM Departments D LEFT OUTER JOIN Employees E
    ON D.dept_id = E.dept_id
