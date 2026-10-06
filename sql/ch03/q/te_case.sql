SELECT key_col, name,
       date_1, flg_1,
       date_2, flg_2,
       date_3, flg_3
  FROM ThreeElements
 WHERE CASE WHEN date_1 = '2013-11-01' THEN flg_1
            WHEN date_2 = '2013-11-01' THEN flg_2
            WHEN date_3 = '2013-11-01' THEN flg_3
            ELSE NULL END = 'T'
