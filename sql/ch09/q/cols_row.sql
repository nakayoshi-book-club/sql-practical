UPDATE ScoreCols
   SET (score_en, score_nl, score_mt)
         = (SELECT MAX(CASE WHEN subject = '英語'
                            THEN score
                            ELSE NULL END) AS score_en,
                   MAX(CASE WHEN subject = '国語'
                            THEN score
                            ELSE NULL END) AS score_nl,
                   MAX(CASE WHEN subject = '数学'
                            THEN score
                            ELSE NULL END) AS score_mt
              FROM ScoreRows SR
             WHERE SR.student_id = ScoreCols.student_id)
