UPDATE ScoreRowsNN
   SET score = (SELECT COALESCE(CASE ScoreRowsNN.subject
                                     WHEN '英語' THEN score_en
                                     WHEN '国語' THEN score_nl
                                     WHEN '数学' THEN score_mt
                                     ELSE NULL
                                 END, 0)
                  FROM ScoreCols2
                 WHERE student_id = ScoreRowsNN.student_id)
