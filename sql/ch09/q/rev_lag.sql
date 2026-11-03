WITH VIEW_LAG (keycol, seq, pre_val)
  AS (SELECT keycol, seq,
             LAG(val, 1) OVER (PARTITION BY keycol
                                   ORDER BY seq)
        FROM OmitFilled)
UPDATE OmitFilled
   SET val = CASE WHEN (SELECT pre_val
                          FROM VIEW_LAG
                         WHERE VIEW_LAG.keycol = OmitFilled.keycol
                           AND VIEW_LAG.seq = OmitFilled.seq) = val
                  THEN NULL
                  ELSE val END
