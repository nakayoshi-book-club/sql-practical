UPDATE ScoreColsNN
   SET (score_en, score_nl, score_mt)
         = (SELECT COALESCE(MAX(CASE WHEN subject = '英語'
                                     THEN score
                                     ELSE NULL END), 0) AS score_en,
                   COALESCE(MAX(CASE WHEN subject = '国語'
                                     THEN score
                                     ELSE NULL END), 0) AS score_nl,
                   COALESCE(MAX(CASE WHEN subject = '数学'
                                     THEN score
                                     ELSE NULL END), 0) AS score_mt
              FROM ScoreRows SR
             WHERE SR.student_id = ScoreColsNN.student_id)
