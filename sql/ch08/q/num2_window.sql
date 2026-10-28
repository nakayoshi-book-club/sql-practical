SELECT class, student_id,
       ROW_NUMBER() OVER (ORDER BY class, student_id) AS seq
  FROM Weights2
