UPDATE Weights3
   SET seq = (SELECT seq
                FROM (SELECT class, student_id,
                             ROW_NUMBER()
                               OVER (PARTITION BY class
                                         ORDER BY student_id) AS seq
                        FROM Weights3) SeqTbl
               WHERE Weights3.class = SeqTbl.class
                 AND Weights3.student_id = SeqTbl.student_id)
