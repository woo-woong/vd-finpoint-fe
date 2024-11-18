import { ref, computed, watchEffect, onMounted } from 'vue';
import ky from 'ky';

export default function useFinProducts({
  path,
  searchParams = {},
  defaultVisibleCount = 3,
}) {
  const API_URL = `${import.meta.env.VITE_FINANCIAL_API_URL}finance/${path}`;
  const memoizedSearchParams = computed(() => searchParams);

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
          searchParams: memoizedSearchParams.value,
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

  onMounted(() => {
    fetchData();
  });

  watchEffect(() => {
    // When `path` or `memoizedSearchParams` changes, refetch data
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
