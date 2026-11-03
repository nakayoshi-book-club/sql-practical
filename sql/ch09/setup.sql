CREATE TABLE OmitTbl (keycol CHAR(8) NOT NULL, seq INTEGER NOT NULL, val INTEGER, CONSTRAINT pk_OmitTbl PRIMARY KEY (keycol, seq));
INSERT INTO OmitTbl VALUES ('A',1,50),('A',2,NULL),('A',3,NULL),('A',4,70),('A',5,NULL),('A',6,900),('B',1,10),('B',2,20),('B',3,NULL),('B',4,3),('B',5,NULL),('B',6,NULL);

CREATE TABLE OmitFilled (keycol CHAR(8) NOT NULL, seq INTEGER NOT NULL, val INTEGER, CONSTRAINT pk_OmitFilled PRIMARY KEY (keycol, seq));
INSERT INTO OmitFilled VALUES ('A',1,50),('A',2,50),('A',3,50),('A',4,70),('A',5,70),('A',6,900),('B',1,10),('B',2,20),('B',3,20),('B',4,3),('B',5,3),('B',6,3);

CREATE TABLE ScoreRows (student_id CHAR(4) NOT NULL, subject VARCHAR(8) NOT NULL, score INTEGER, CONSTRAINT pk_ScoreRows PRIMARY KEY (student_id, subject));
INSERT INTO ScoreRows VALUES ('A001','英語',100),('A001','国語',58),('A001','数学',90),('B002','英語',77),('B002','国語',60),('C003','英語',52),('C003','国語',49),('C003','社会',100);

CREATE TABLE ScoreCols (student_id CHAR(4) NOT NULL, score_en INTEGER, score_nl INTEGER, score_mt INTEGER, CONSTRAINT pk_ScoreCols PRIMARY KEY (student_id));
INSERT INTO ScoreCols VALUES ('A001',NULL,NULL,NULL),('B002',NULL,NULL,NULL),('C003',NULL,NULL,NULL),('D004',NULL,NULL,NULL);

CREATE TABLE ScoreColsNN (student_id CHAR(4) NOT NULL, score_en INTEGER NOT NULL, score_nl INTEGER NOT NULL, score_mt INTEGER NOT NULL, CONSTRAINT pk_ScoreColsNN PRIMARY KEY (student_id));
INSERT INTO ScoreColsNN VALUES ('A001',0,0,0),('B002',0,0,0),('C003',0,0,0),('D004',0,0,0);

CREATE TABLE ScoreCols2 (student_id CHAR(4) NOT NULL, score_en INTEGER, score_nl INTEGER, score_mt INTEGER, CONSTRAINT pk_ScoreCols2 PRIMARY KEY (student_id));
INSERT INTO ScoreCols2 VALUES ('A001',100,58,90),('B002',77,60,NULL),('C003',52,49,NULL),('D004',10,70,100);

CREATE TABLE ScoreRows2 (student_id CHAR(4) NOT NULL, subject VARCHAR(8) NOT NULL, score INTEGER, CONSTRAINT pk_ScoreRows2 PRIMARY KEY (student_id, subject));
INSERT INTO ScoreRows2 VALUES ('A001','英語',NULL),('A001','国語',NULL),('A001','数学',NULL),('B002','英語',NULL),('B002','国語',NULL),('C003','英語',NULL),('C003','国語',NULL),('C003','社会',NULL);

CREATE TABLE ScoreRowsNN (student_id CHAR(4) NOT NULL, subject VARCHAR(8) NOT NULL, score INTEGER NOT NULL, CONSTRAINT pk_ScoreRowsNN PRIMARY KEY (student_id, subject));
INSERT INTO ScoreRowsNN VALUES ('A001','英語',0),('A001','国語',0),('A001','数学',0),('B002','英語',0),('B002','国語',0),('C003','英語',0),('C003','国語',0),('C003','社会',0);

CREATE TABLE Stocks (brand VARCHAR(8) NOT NULL, sale_date DATE NOT NULL, price INTEGER NOT NULL, CONSTRAINT pk_Stocks PRIMARY KEY (brand, sale_date));
INSERT INTO Stocks VALUES ('A鉄鋼','2008-07-01',1000),('A鉄鋼','2008-07-04',1200),('A鉄鋼','2008-08-12',800),('B商社','2008-06-04',3000),('B商社','2008-09-11',3000),('C電気','2008-07-01',9000),('D産業','2008-06-04',5000),('D産業','2008-06-05',5000),('D産業','2008-06-06',4800),('D産業','2008-12-01',5100);

CREATE TABLE Stocks2 (brand VARCHAR(8) NOT NULL, sale_date DATE NOT NULL, price INTEGER NOT NULL, trend CHAR(3), CONSTRAINT pk_Stocks2 PRIMARY KEY (brand, sale_date));

CREATE TABLE Orders (order_id INTEGER NOT NULL, order_shop VARCHAR(32) NOT NULL, order_name VARCHAR(32) NOT NULL, order_date DATE, PRIMARY KEY (order_id));
INSERT INTO Orders VALUES (10000,'東京','後藤信二','2011-08-22'),(10001,'埼玉','佐原商店','2011-09-01'),(10002,'千葉','水原陽子','2011-09-20'),(10003,'山形','加地健太郎','2011-08-05'),(10004,'青森','相原酒店','2011-08-22'),(10005,'長野','宮元雄介','2011-08-29');

CREATE TABLE OrderReceipts (order_id INTEGER NOT NULL, order_receipt_id INTEGER NOT NULL, item_group VARCHAR(32) NOT NULL, delivery_date DATE NOT NULL, PRIMARY KEY (order_id, order_receipt_id));
INSERT INTO OrderReceipts VALUES (10000,1,'食器','2011-08-24'),(10000,2,'菓子詰め合わせ','2011-08-25'),(10000,3,'牛肉','2011-08-26'),(10001,1,'魚介類','2011-09-04'),(10002,1,'菓子詰め合わせ','2011-09-22'),(10002,2,'調味料セット','2011-09-22'),(10003,1,'米','2011-08-06'),(10003,2,'牛肉','2011-08-10'),(10003,3,'食器','2011-08-10'),(10004,1,'野菜','2011-08-23'),(10005,1,'飲料水','2011-08-30'),(10005,2,'菓子詰め合わせ','2011-08-30');
