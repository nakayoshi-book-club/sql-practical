SELECT MIN(num) AS low,
       '〜',
       MAX(num) AS high
  FROM (SELECT N1.num,
               COUNT(N2.num) - N1.num AS gp
          FROM Numbers N1
               INNER JOIN Numbers N2
                  ON N2.num <= N1.num
         GROUP BY N1.num) N
 GROUP BY gp
 ORDER BY low
