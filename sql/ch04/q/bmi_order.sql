SELECT CASE WHEN weight / POWER(height / 100, 2) < 25 THEN '標準'
            WHEN weight / POWER(height / 100, 2) < 18.5 THEN 'やせ'
            ELSE '肥満' END AS bmi,
       COUNT(*)
  FROM Persons
 GROUP BY bmi
