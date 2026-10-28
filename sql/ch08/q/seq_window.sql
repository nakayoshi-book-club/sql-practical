SELECT MIN(num) AS low,
       '〜',
       MAX(num) AS high
  FROM (SELECT num,
               num - ROW_NUMBER() OVER (ORDER BY num) AS gp
          FROM Numbers) TMP
 GROUP BY gp
 ORDER BY low
