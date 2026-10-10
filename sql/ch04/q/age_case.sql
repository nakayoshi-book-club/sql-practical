SELECT CASE WHEN age < 20 THEN '子供'
            WHEN age BETWEEN 20 AND 69 THEN '成人'
            WHEN age >= 70 THEN '老人'
            ELSE NULL END AS age_class,
       COUNT(*)
  FROM Persons
 GROUP BY CASE WHEN age < 20 THEN '子供'
               WHEN age BETWEEN 20 AND 69 THEN '成人'
               WHEN age >= 70 THEN '老人'
               ELSE NULL END
