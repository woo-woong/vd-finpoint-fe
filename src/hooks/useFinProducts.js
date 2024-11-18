import { ref, watch, onMounted } from 'vue';
import ky from 'ky';

export default function useFinProducts({
  path,
  searchParams = {},
  defaultVisibleCount = 3,
}) {
  const API_URL = `${import.meta.env.VITE_FINANCIAL_API_URL}finance/${path}`;

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
      const response = await ky
        .get(API_URL, {
          searchParams: searchParams,
        })
        .json();
      finProducts.value = response;
    } catch (err) {
      console.error('Failed to fetch data:', err);
      error.value = err instanceof Error ? err : new Error('Unknown error');
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
