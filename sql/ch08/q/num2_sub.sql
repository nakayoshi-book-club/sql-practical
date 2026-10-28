SELECT class, student_id,
       (SELECT COUNT(*)
          FROM Weights2 W2
         WHERE (W2.class, W2.student_id)
                 <= (W1.class, W1.student_id)) AS seq
  FROM Weights2 W1
