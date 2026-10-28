SELECT student_id, weight,
       ROW_NUMBER() OVER (ORDER BY weight ASC) AS hi,
       ROW_NUMBER() OVER (ORDER BY weight DESC) AS lo
  FROM WeightsEx8
