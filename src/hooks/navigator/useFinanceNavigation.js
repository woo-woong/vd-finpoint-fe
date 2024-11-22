import { useRouter } from 'vue-router';

export function useFinanceNavigation() {
  const router = useRouter();

  const navigateToFinProductDetail = (type, fin_prdt_cd) => {
    if (type && fin_prdt_cd) {
      router.push({
        path: `/${type.toLowerCase()}/detail/`,
        query: { finPrdtCd: fin_prdt_cd },
      });
    } else {
      console.warn('상품 정보가 부족합니다.');
    }
  };

  return {
    navigateToFinProductDetail,
  };
}
