SELECT room_nbr,
       SUM(end_date - start_date) AS working_days
  FROM HotelRooms
 GROUP BY room_nbr
HAVING SUM(end_date - start_date) >= 10
