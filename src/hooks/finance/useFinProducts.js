import { ref, watch, onMounted } from 'vue';
import FinProductsService from '@services/FinProductsService';

export default function useFinProducts({
  path,
  searchParams = {},
  defaultVisibleCount = 3,
}) {
  const finProducts = ref(null);
  const error = ref(null);
  const isLoading = ref(true);
  const visibleCount = ref(defaultVisibleCount);

  const loadMoreProducts = () => {
    visibleCount.value += defaultVisibleCount;
  };

  const fetchData = async () => {
    try {
      isLoading.value = true;
      const response = await FinProductsService(path, searchParams);
      finProducts.value = response;
    } catch (err) {
      console.error('데이터 로딩 실패:', err);
      error.value =
        '금융 상품 데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.';
    } finally {
      isLoading.value = false;
    }
  };

  // path나 searchParams가 변경될 때만 데이터를 다시 가져옵니다
  watch(
    [() => path, () => searchParams],
    () => {
      fetchData();
    },
    { deep: true }
  );

  // 컴포넌트가 마운트될 때 초기 데이터를 가져옵니다
  onMounted(() => {
    fetchData();
  });

  return {
    finProducts,
    error,
    visibleCount,
    isLoading,
    loadMoreProducts,
  };
}
