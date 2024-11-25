export function useFinanceNavigation() {
  const navigateToFinProductDetail = (type, fin_prdt_cd) => {
    if (type && fin_prdt_cd) {
      // router 없이 페이지 이동이라 수정 필요
      // router.push로 하면 새로고침이 안되는 현상 발생
      window.location.href = `/${type.toLowerCase()}/detail/?finPrdtCd=${fin_prdt_cd}`;
    } else {
      console.warn('상품 정보가 부족합니다.');
    }
  };

  return {
    navigateToFinProductDetail,
  };
}
