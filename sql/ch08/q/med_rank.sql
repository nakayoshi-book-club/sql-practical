SELECT student_id, weight,
       RANK() OVER (ORDER BY weight ASC) AS hi,
       RANK() OVER (ORDER BY weight DESC) AS lo
  FROM WeightsEven
