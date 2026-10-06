SELECT key_col, name,
       date_1, flg_1,
       date_2, flg_2,
       date_3, flg_3
  FROM ThreeElements
 WHERE ('2013-11-01', 'T')
       IN ((date_1, flg_1),
           (date_2, flg_2),
           (date_3, flg_3))
