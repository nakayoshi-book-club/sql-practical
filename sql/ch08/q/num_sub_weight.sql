SELECT student_id,
       (SELECT COUNT(*)
          FROM Weights W2
         WHERE W2.weight <= W1.weight) AS seq
  FROM Weights W1
