CREATE TABLE Items (item_id INTEGER NOT NULL, year INTEGER NOT NULL, item_name VARCHAR(32) NOT NULL, price_tax_ex INTEGER NOT NULL, price_tax_in INTEGER NOT NULL, PRIMARY KEY (item_id, year));
INSERT INTO Items VALUES
(100,2000,'カップ',500,525),(100,2001,'カップ',520,546),(100,2002,'カップ',600,630),(100,2003,'カップ',600,630),
(101,2000,'スプーン',500,525),(101,2001,'スプーン',500,525),(101,2002,'スプーン',500,525),(101,2003,'スプーン',500,525),
(102,2000,'ナイフ',600,630),(102,2001,'ナイフ',550,577),(102,2002,'ナイフ',550,577),(102,2003,'ナイフ',400,420);

CREATE TABLE Population (prefecture VARCHAR(32), sex CHAR(1), pop INTEGER NOT NULL, PRIMARY KEY (prefecture, sex));
INSERT INTO Population VALUES
('徳島','1',60),('徳島','2',40),('香川','1',90),('香川','2',100),('愛媛','1',100),('愛媛','2',50),
('高知','1',100),('高知','2',100),('福岡','1',20),('福岡','2',200);

CREATE TABLE CustomerCount (record_date DATE PRIMARY KEY, dow CHAR(3) NOT NULL, customers INTEGER NOT NULL);
INSERT INTO CustomerCount VALUES
('2024-11-12','Mon',212),('2024-11-13','Tue',540),('2024-11-14','Wed',145),('2024-11-15','Thr',321),
('2024-11-16','Fri',670),('2024-11-17','Sat',518),('2024-11-18','Sun',420),('2024-11-19','Mon',376),
('2024-11-20','Tue',222),('2024-11-21','Wed',518),('2024-11-22','Thr',842),('2024-11-23','Fri',632),
('2024-11-24','Sat',190),('2024-11-25','Sun',341);

CREATE TABLE Employees (emp_id INTEGER, team_id INTEGER, emp_name VARCHAR(32), team VARCHAR(32), PRIMARY KEY (emp_id, team_id));
INSERT INTO Employees VALUES
(201,1,'Joe','商品企画'),(201,2,'Joe','開発'),(201,3,'Joe','営業'),(202,2,'Jim','開発'),(203,3,'Carl','営業'),
(204,1,'Bree','商品企画'),(204,2,'Bree','開発'),(204,3,'Bree','営業'),(204,4,'Bree','管理'),
(205,1,'Kim','商品企画'),(205,2,'Kim','開発');

CREATE TABLE ThreeElements (key_col INTEGER PRIMARY KEY, name VARCHAR(32), date_1 DATE, flg_1 CHAR(1), date_2 DATE, flg_2 CHAR(1), date_3 DATE, flg_3 CHAR(1));
INSERT INTO ThreeElements VALUES
(1,'a','2013-11-01','T',NULL,NULL,NULL,NULL),(2,'b',NULL,NULL,'2013-11-01','T',NULL,NULL),
(3,'c',NULL,NULL,'2013-11-01','F',NULL,NULL),(4,'d',NULL,NULL,'2013-12-30','T',NULL,NULL),
(5,'e',NULL,NULL,NULL,NULL,'2013-11-01','T'),(6,'f',NULL,NULL,NULL,NULL,'2013-12-01','F');
CREATE INDEX IDX_1 ON ThreeElements (date_1, flg_1);
CREATE INDEX IDX_2 ON ThreeElements (date_2, flg_2);
CREATE INDEX IDX_3 ON ThreeElements (date_3, flg_3);
