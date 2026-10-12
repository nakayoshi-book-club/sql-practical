SELECT CASE WHEN weight / POWER(height / 100, 2) < 18.5 THEN 'やせ'
            WHEN 18.5 <= weight / POWER(height / 100, 2)
                 AND weight / POWER(height / 100, 2) < 25 THEN '標準'
            WHEN 25 <= weight / POWER(height / 100, 2) THEN '肥満'
            ELSE NULL END AS bmi,
       COUNT(*)
  FROM Persons
 GROUP BY bmi
