UPDATE OmitTbl
   SET val = (SELECT pre_val
                FROM (SELECT keycol, seq,
                             LAG(val, 1) OVER (PARTITION BY keycol
                                                   ORDER BY seq) AS pre_val
                        FROM OmitTbl) LG
               WHERE LG.keycol = OmitTbl.keycol
                 AND LG.seq = OmitTbl.seq)
 WHERE val IS NULL
