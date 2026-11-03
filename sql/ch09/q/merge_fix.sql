MERGE INTO ScoreColsNN
   USING (SELECT student_id,
                 COALESCE(MAX(CASE WHEN subject = '英語'
                                   THEN score
                                   ELSE NULL END), 0) AS score_en,
                 COALESCE(MAX(CASE WHEN subject = '国語'
                                   THEN score
                                   ELSE NULL END), 0) AS score_nl,
                 COALESCE(MAX(CASE WHEN subject = '数学'
                                   THEN score
                                   ELSE NULL END), 0) AS score_mt
            FROM ScoreRows
           GROUP BY student_id) SR
      ON (ScoreColsNN.student_id = SR.student_id)
   WHEN MATCHED THEN
        UPDATE SET score_en = SR.score_en,
                   score_nl = SR.score_nl,
                   score_mt = SR.score_mt
