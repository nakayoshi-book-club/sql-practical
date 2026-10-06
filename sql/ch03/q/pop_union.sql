SELECT prefecture, SUM(pop_men) AS pop_men, SUM(pop_wom) AS pop_wom
  FROM (SELECT prefecture, pop AS pop_men, NULL AS pop_wom
          FROM Population
         WHERE sex = '1'
        UNION
        SELECT prefecture, NULL AS pop_men, pop AS pop_wom
          FROM Population
         WHERE sex = '2') TMP
 GROUP BY prefecture
