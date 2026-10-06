SELECT v_address, cnt
  FROM (SELECT address AS v_address, COUNT(*) AS cnt
          FROM Address
         GROUP BY address) CountAddress