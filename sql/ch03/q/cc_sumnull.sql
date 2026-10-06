SELECT SUM(CASE WHEN dow = 'Mon' THEN customers END) AS mon,
       SUM(CASE WHEN dow = 'Tue' THEN customers END) AS tue,
       SUM(CASE WHEN dow = 'Sat' THEN customers END) AS sat,
       SUM(CASE WHEN dow = 'Sun' THEN customers END) AS sun
  FROM CustomerCount
