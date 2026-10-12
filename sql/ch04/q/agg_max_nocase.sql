SELECT id,
       MAX(data_1) AS data_1,
       MAX(data_2) AS data_2,
       MAX(data_3) AS data_3,
       MAX(data_4) AS data_4,
       MAX(data_5) AS data_5,
       MAX(data_6) AS data_6
  FROM NonAggTbl
 GROUP BY id
