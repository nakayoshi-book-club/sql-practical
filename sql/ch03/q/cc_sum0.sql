SELECT SUM(CASE WHEN dow = 'Mon' THEN customers ELSE 0 END) AS mon,
       SUM(CASE WHEN dow = 'Tue' THEN customers ELSE 0 END) AS tue,
       SUM(CASE WHEN dow = 'Sat' THEN customers ELSE 0 END) AS sat,
       SUM(CASE WHEN dow = 'Sun' THEN customers ELSE 0 END) AS sun
  FROM CustomerCount
