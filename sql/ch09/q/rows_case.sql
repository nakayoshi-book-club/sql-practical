UPDATE ScoreRows2
   SET score = (SELECT CASE ScoreRows2.subject
                            WHEN '英語' THEN score_en
                            WHEN '国語' THEN score_nl
                            WHEN '数学' THEN score_mt
                            ELSE NULL
                        END
                  FROM ScoreCols2
                 WHERE student_id = ScoreRows2.student_id)
