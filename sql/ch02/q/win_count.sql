SELECT address,
       COUNT(*) OVER(PARTITION BY address)
  FROM Address