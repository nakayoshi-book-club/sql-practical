SELECT D1.digit + (D2.digit * 10) AS seq
  FROM Digits D1 CROSS JOIN Digits D2
