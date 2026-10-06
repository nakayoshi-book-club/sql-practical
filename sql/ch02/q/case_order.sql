SELECT name, age,
       CASE WHEN age >= 30 THEN '30歳以上'
            WHEN age >= 40 THEN '40歳以上'
            ELSE '30歳未満' END AS age_group
  FROM Address