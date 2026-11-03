UPDATE OmitFilled
   SET val = CASE WHEN val
                    = (SELECT val
                         FROM OmitFilled O1
                        WHERE O1.keycol = OmitFilled.keycol
                          AND O1.seq
                                = (SELECT MAX(seq)
                                     FROM OmitFilled O2
                                    WHERE O2.keycol = OmitFilled.keycol
                                      AND O2.seq < OmitFilled.seq))
                  THEN NULL
                  ELSE val END
