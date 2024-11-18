import ProductList from '@components/ProductList';

export default {
  name: 'Savings',
  setup() {
    return () => (
      <ProductList
        path="savings"
        searchParams={{ topFinGrpNo: '020000', pageNo: '1' }}
      />
    );
  },
};
