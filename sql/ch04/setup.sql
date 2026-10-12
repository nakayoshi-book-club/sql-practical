CREATE TABLE NonAggTbl (id VARCHAR(32) NOT NULL, data_type CHAR(1) NOT NULL, data_1 INTEGER, data_2 INTEGER, data_3 INTEGER, data_4 INTEGER, data_5 INTEGER, data_6 INTEGER, PRIMARY KEY (id, data_type));
INSERT INTO NonAggTbl VALUES
('Jim','A',100,10,34,346,54,NULL),('Jim','B',45,2,167,77,90,157),('Jim','C',NULL,3,687,1355,324,457),
('Ken','A',78,5,724,457,NULL,1),('Ken','B',123,12,178,346,85,235),('Ken','C',45,NULL,23,46,687,33),
('Beth','A',75,0,190,25,356,NULL),('Beth','B',435,0,183,NULL,4,325),('Beth','C',96,128,NULL,0,0,12);

CREATE TABLE HotelRooms (room_nbr INTEGER, start_date DATE, end_date DATE, PRIMARY KEY (room_nbr, start_date));
INSERT INTO HotelRooms VALUES
(101,'2008-02-01','2008-02-06'),(101,'2008-02-06','2008-02-08'),(101,'2008-02-10','2008-02-13'),
(202,'2008-02-05','2008-02-08'),(202,'2008-02-08','2008-02-11'),(202,'2008-02-11','2008-02-12'),
(303,'2008-02-03','2008-02-17');

CREATE TABLE Persons (name VARCHAR(8) NOT NULL, age INTEGER NOT NULL, height FLOAT NOT NULL, weight FLOAT NOT NULL, PRIMARY KEY (name));
INSERT INTO Persons VALUES
('Anderson',30,188,90),('Adela',21,167,55),('Bates',87,158,48),('Becky',54,187,70),('Bill',39,177,120),
('Chris',90,175,48),('Darwin',12,160,55),('Dawson',25,182,90),('Donald',30,176,53);
