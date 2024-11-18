import ProductList from '@components/ProductList';

export default {
  name: 'RentHouseLoan',
  setup() {
    return () => (
      <ProductList
        path="rent-house-loan"
        searchParams={{ topFinGrpNo: '020000', pageNo: '1' }}
      />
    );
  },
};
