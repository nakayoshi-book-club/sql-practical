UPDATE OmitTbl
   SET val = (SELECT val
                FROM OmitTbl OT1
               WHERE OT1.keycol = OmitTbl.keycol
                 AND OT1.seq = (SELECT MAX(seq)
                                  FROM OmitTbl OT2
                                 WHERE OT2.keycol = OmitTbl.keycol
                                   AND OT2.seq < OmitTbl.seq))
 WHERE val IS NULL
