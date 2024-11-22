import { useRouter } from 'vue-router';

export function useFinanceNavigation() {
  const router = useRouter();

  const navigateToFinProductDetail = (companyName) => {
    router.push({
      path: `/${companyName.toLowerCase()}/detail`,
      replace: false,
    });
  };

  return {
    navigateToFinProductDetail,
  };
}
