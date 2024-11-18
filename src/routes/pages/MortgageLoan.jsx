import ProductList from '@components/ProductList';

// 주택담보대출
export default {
  name: 'MortgageLoan',
  setup() {
    return () => (
      <ProductList
        path="mortgage-loan"
        searchParams={{ topFinGrpNo: '020000', pageNo: '1' }}
      />
    );
  },
};
