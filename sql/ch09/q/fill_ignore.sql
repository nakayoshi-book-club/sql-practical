SELECT keycol, seq,
       FIRST_VALUE(val) IGNORE NULLS
         OVER (PARTITION BY keycol
                   ORDER BY seq) AS val
  FROM OmitTbl
