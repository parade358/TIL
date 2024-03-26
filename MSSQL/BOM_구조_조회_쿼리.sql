-- 한국후꼬꾸 주요 완제품인 와이퍼 블레이드(W/B)에 대한 BOM 구조를 쿼리로 조회
-- 제품코드 : SR2F-16
-- 제품명 : W/B(SR2F-16 NR)
-- 주요 테이블
-- 품목 마스터 : TB_PART
-- BOM 마스터 : TB_PART_BOM
-- 조회 결과 예상(*14행 이상 데이터 있음)


-- TB_PART 조회구문
SELECT TOP 1000 * FROM TB_PART WHERE PART_ID = 'B1-000711'

-- TB_PART_BOM 조회구문
SELECT TOP 1000 * FROM TB_PART_BOM WHERE PARENT_PART_ID = 'SR2F-16'

-- 항목 출력
SELECT TPB.PARENT_PART_ID AS '모품번'
	 , TP.PART_NAME AS '모품명'
	 , TPB.PART_ID AS '자품번'
	 , (SELECT PART_NAME
		FROM TB_PART
		WHERE PART_ID = TPB.PART_ID) AS '자품명'
	 , TPB.PER_QTY AS '소요수량'
FROM TB_PART_BOM AS TPB
LEFT JOIN TB_PART AS TP ON TPB.PARENT_PART_ID = TP.PART_ID
WHERE TPB.PARENT_PART_ID = 'SR2F-16'


-- BOM 구조 쿼리 조회
WITH CTE_PART AS (
	SELECT TPB.PARENT_PART_ID AS 모품번
		 , 1 AS 레벨
		 , TP.PART_NAME AS 모품명
		 , TPB.PART_ID AS 자품번
		 , (SELECT PART_NAME
			FROM TB_PART
			WHERE PART_ID = TPB.PART_ID) AS 자품명
		 , TPB.PER_QTY AS 소요수량
	FROM TB_PART_BOM AS TPB
	LEFT JOIN TB_PART AS TP ON TPB.PARENT_PART_ID = TP.PART_ID
	WHERE PARENT_PART_ID = 'SR2F-16'

	UNION ALL

	SELECT TPB.PARENT_PART_ID AS 모품번
		 , CP.레벨 + 1 AS 레벨
		 , TP.PART_NAME AS 모품명
		 , TPB.PART_ID AS 자품번
		 , (SELECT PART_NAME
			FROM TB_PART
			WHERE PART_ID = TPB.PART_ID) AS 자품명
		 , TPB.PER_QTY AS 소요수량
	FROM TB_PART_BOM AS TPB
	INNER JOIN TB_PART AS TP ON TPB.PARENT_PART_ID = TP.PART_ID
	INNER JOIN CTE_PART AS CP ON TPB.PARENT_PART_ID = CP.자품번
	WHERE TPB.PARENT_PART_ID = CP.자품번

)
SELECT *
FROM CTE_PART
ORDER BY 레벨, 자품번;
