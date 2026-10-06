SELECT dow, SUM(customers) AS customers
  FROM CustomerCount
 WHERE dow IN ('Mon', 'Tue', 'Sat', 'Sun')
 GROUP BY dow
