UPDATE Weights3
   SET seq = ROW_NUMBER()
               OVER (PARTITION BY class
                         ORDER BY student_id)
