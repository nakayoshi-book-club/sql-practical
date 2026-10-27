SELECT student_id,
       RANK() OVER (ORDER BY weight) AS seq
  FROM Weights
