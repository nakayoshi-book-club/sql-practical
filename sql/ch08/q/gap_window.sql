SELECT num + 1 AS gap_start,
       '〜',
       (num + diff - 1) AS gap_end
  FROM (SELECT num,
               MAX(num)
                 OVER (ORDER BY num
                        ROWS BETWEEN 1 FOLLOWING
                                 AND 1 FOLLOWING) - num AS diff
          FROM Numbers) TMP
 WHERE diff <> 1
 ORDER BY gap_start
