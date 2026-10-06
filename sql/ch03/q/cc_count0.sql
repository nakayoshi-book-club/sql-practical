SELECT COUNT(CASE WHEN dow = 'Mon' THEN customers ELSE 0 END) AS mon,
       COUNT(CASE WHEN dow = 'Tue' THEN customers ELSE 0 END) AS tue,
       COUNT(CASE WHEN dow = 'Sat' THEN customers ELSE 0 END) AS sat,
       COUNT(CASE WHEN dow = 'Sun' THEN customers ELSE 0 END) AS sun
  FROM CustomerCount
