SELECT key_col, name,
       date_1, flg_1,
       date_2, flg_2,
       date_3, flg_3
  FROM ThreeElements
 WHERE (date_1 = '2013-11-01' AND flg_1 = 'T')
    OR (date_2 = '2013-11-01' AND flg_2 = 'T')
    OR (date_3 = '2013-11-01' AND flg_3 = 'T')
