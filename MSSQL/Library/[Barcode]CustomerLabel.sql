-- ����� ã�¹�
/*���Ϲ�ȣ�� CLIENT_ID ã��*/
SELECT CLIENT_ID FROM TB_DEV_ORDER WHERE DEV_ORDER_ID = '' AND PLANT_ID = ''

/*CLIENT_ID�� ���� ǰ�� ������, ���� ã��*/
SELECT PROD_BARCODE_START_POINT FROM TB_CLIENT WHERE CLIENT_ID = '' AND VALID='1'

SELECT PROD_BARCODE_END_POINT FROM TB_CLIENT WHERE CLIENT_ID = '' AND VALID='1'

/*CLIENT_ID�� PART_ID �� CUSTOMER_PART_ID ã��*/
SELECT * FROM UTB_CUSTOMER_PART_ID_INFO WHERE PLANT_ID= '' AND CLIENT_ID = ''  AND VALID ='1' AND PART_ID = ''

-- �������� ���� �̿��ؼ� ����� �����


--���ڵ� ã�¹�
SELECT TOP 100 *
FROM UTB_PROD_BARCODE_HIST UPBH (NOLOCK)   
WHERE UPBH.PLANT_ID = '' AND UPBH.BCD_VALID_YN ='Y' AND CANCEL_YN = 'N' AND SUB_LOCATION_ID = '' AND PART_ID = ''
ORDER BY ROW_STAMP DESC


-- ��ǰǥ/�԰�ǥ ã�¹�
-- let lot_no = scanData.substring(17);
-- let inv_id = scanData.substring(3, 10);
-- �� �ΰ� �����ϰ� 25���� ���߱�