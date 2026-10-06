CREATE TABLE Address (name VARCHAR(32) NOT NULL, phone_nbr VARCHAR(32), address VARCHAR(32) NOT NULL, sex CHAR(4) NOT NULL, age INTEGER NOT NULL, PRIMARY KEY (name));
INSERT INTO Address VALUES
('小川','080-3333-XXXX','東京都','男',30),('前田','090-0000-XXXX','東京都','女',21),('森','090-2984-XXXX','東京都','男',45),
('林','080-3333-XXXX','福島県','男',32),('井上',NULL,'福島県','女',55),('佐々木','080-5848-XXXX','千葉県','女',19),
('松本',NULL,'千葉県','女',20),('佐藤','090-1922-XXXX','三重県','女',25),('鈴木','090-0001-XXXX','和歌山県','男',32);
CREATE TABLE Address2 (name VARCHAR(32) NOT NULL, phone_nbr VARCHAR(32), address VARCHAR(32) NOT NULL, sex CHAR(4) NOT NULL, age INTEGER NOT NULL, PRIMARY KEY (name));
INSERT INTO Address2 VALUES
('小川','080-3333-XXXX','東京都','男',30),('林','080-3333-XXXX','福島県','男',32),('武田',NULL,'福島県','男',18),
('斉藤','080-2367-XXXX','千葉県','女',19),('上野',NULL,'千葉県','女',20),('広田','090-0205-XXXX','三重県','男',25);
CREATE VIEW CountAddress (v_address, cnt) AS
SELECT address, COUNT(*)
  FROM Address
 GROUP BY address;
