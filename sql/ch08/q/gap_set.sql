SELECT (N1.num + 1) AS gap_start,
       '〜',
       (MIN(N2.num) - 1) AS gap_end
  FROM Numbers N1
       INNER JOIN Numbers N2
          ON N2.num > N1.num
 GROUP BY N1.num
HAVING (N1.num + 1) < MIN(N2.num)
 ORDER BY gap_start
