UPDATE ScoreCols
   SET (score_en, score_nl, score_mt)
         = (SELECT CASE WHEN subject = '英語'
                        THEN score
                        ELSE NULL END AS score_en,
                   CASE WHEN subject = '国語'
                        THEN score
                        ELSE NULL END AS score_nl,
                   CASE WHEN subject = '数学'
                        THEN score
                        ELSE NULL END AS score_mt
              FROM ScoreRows SR
             WHERE SR.student_id = ScoreCols.student_id)
