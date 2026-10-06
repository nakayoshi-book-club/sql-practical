SELECT name
  FROM Address
 WHERE name IN (SELECT name
                  FROM Address2)