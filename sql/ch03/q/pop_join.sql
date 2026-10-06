SELECT M.prefecture, M.pop AS pop_men, W.pop AS pop_wom
  FROM Population M
  JOIN Population W
    ON M.prefecture = W.prefecture
 WHERE M.sex = '1'
   AND W.sex = '2'
