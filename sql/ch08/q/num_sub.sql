SELECT student_id,
       (SELECT COUNT(*)
          FROM Weights W2
         WHERE W2.student_id <= W1.student_id) AS seq
  FROM Weights W1
