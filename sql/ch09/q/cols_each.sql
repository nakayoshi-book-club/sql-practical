UPDATE ScoreCols
   SET score_en = (SELECT score
                     FROM ScoreRows SR
                    WHERE SR.student_id = ScoreCols.student_id
                      AND subject = '英語'),
       score_nl = (SELECT score
                     FROM ScoreRows SR
                    WHERE SR.student_id = ScoreCols.student_id
                      AND subject = '国語'),
       score_mt = (SELECT score
                     FROM ScoreRows SR
                    WHERE SR.student_id = ScoreCols.student_id
                      AND subject = '数学')
