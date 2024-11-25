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

  const navigateToOfficialProductHomepage = (kor_co_nm) => {
    // 띄어쓰기 제거 및 정규화
    const normalizedName = kor_co_nm?.replace(/\s+/g, '');

    const officialHomepageUrl = {
      우리은행: 'https://www.wooribank.com/',
      한국스탠다드차타드은행: 'https://www.sc.co.kr/',
      한국씨티은행: 'https://www.citibank.co.kr/',
      하나은행: 'https://www.kebhana.com/',
      아이엠뱅크: 'https://www.imbank.co.kr/',
      부산은행: 'https://www.busanbank.co.kr/',
      광주은행: 'https://www.kjbank.com/',
      제주은행: 'https://www.e-jejubank.com/',
      전북은행: 'https://www.jbbank.co.kr/',
      경남은행: 'https://www.knbank.co.kr/',
      중소기업은행: 'https://www.ibk.co.kr/',
      한국산업은행: 'https://www.kdb.co.kr/',
      국민은행: 'https://www.kbstar.com/',
      신한은행: 'https://www.shinhan.com/',
      농협은행주식회사: 'https://banking.nonghyup.com/',
      주식회사케이뱅크: 'https://www.kbanknow.com/',
      수협은행: 'https://www.suhyup-bank.com/',
      주식회사카카오뱅크: 'https://www.kakaobank.com/',
      토스뱅크주식회사: 'https://www.tossbank.com/',
    };

    const url = officialHomepageUrl[normalizedName];
    if (url) {
      window.open(url, '_blank');
    }
  };

  return {
    navigateToFinProductDetail,
    navigateToOfficialProductHomepage,
  };
}
