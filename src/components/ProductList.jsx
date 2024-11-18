import useFinProducts from '@hooks/useFinProducts';
import Card from '@components/Card';

export default {
  name: 'ProductList',
  props: {
    path: {
      type: String,
      required: true,
    },
    searchParams: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { path, searchParams } = props;
    const { finProducts, error, visibleCount, isLoading, loadMoreProducts } =
      useFinProducts({
        path,
        searchParams,
        defaultVisibleCount: 3,
      });

    const renderProductList = () => {
      if (error.value) {
        return <p>Failed to load data: {error.value.message}</p>;
      }

      if (isLoading.value) {
        return <p>Loading...</p>;
      }

      // 응답 데이터 구조 디버깅
      console.log('finProducts value:', finProducts.value);

      if (!finProducts.value) {
        return <p>No products available.</p>;
      }

      // 배열인지 확인
      if (!Array.isArray(finProducts.value)) {
        console.error('Expected array, got:', typeof finProducts.value);
        return <p>Invalid data format</p>;
      }

      return (
        <div class="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
          {finProducts.value.slice(0, visibleCount.value).map((product) => (
            <Card key={product.finPrdtCd} product={product} />
          ))}
        </div>
      );
    };

    return () => (
      <>
        {renderProductList()}
        {finProducts.value && finProducts.value.length > visibleCount.value && (
          <button
            type="button"
            onClick={loadMoreProducts}
            class="p-5 font-black rounded-md shadow-md"
          >
            more
          </button>
        )}
      </>
    );
  },
};
