SELECT TITIT.U_SOT_BCD, U_QC_FLAG
FROM TB_INV_TRANS_IN_TMP TITIT (NOLOCK)
JOIN TB_PART TP (NOLOCK) ON TP.PLANT_ID = TITIT.PLANT_ID AND TITIT.PART_ID = TP.PART_ID AND TP.VALID ='1'  
WHERE TITIT.INV_TRANS_TYPE_ID IN('IN_BUY','ORG_TRANS') AND TITIT.PLANT_ID = '103' AND U_QC_FLAG NOT IN ('NG') AND TITIT.VALID NOT IN ('0','2') AND TITIT.U_CLOSE_FLAG IN ('1','0')

SELECT *
FROM TB_INV_TRANS_IN_TMP TITIT (NOLOCK)
JOIN TB_PART TP (NOLOCK) ON TP.PLANT_ID = TITIT.PLANT_ID AND TITIT.PART_ID = TP.PART_ID AND TP.VALID ='1'  
WHERE TITIT.U_SOT_BCD = '9172016012701' AND TITIT.INV_TRANS_TYPE_ID IN('IN_BUY','ORG_TRANS') AND TITIT.PLANT_ID = '103' AND U_QC_FLAG NOT IN ('NG') AND TITIT.VALID NOT IN ('0','2') AND TITIT.U_CLOSE_FLAG IN ('1','0')

SELECT * FROM TB_LOC WHERE PLANT_ID = '103' AND VALID='1'