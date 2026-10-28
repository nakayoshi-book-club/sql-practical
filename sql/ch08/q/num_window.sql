SELECT student_id,
       ROW_NUMBER() OVER (ORDER BY student_id) AS seq
  FROM Weights
