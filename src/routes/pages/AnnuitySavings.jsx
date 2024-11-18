import ProductList from '@components/ProductList';

// 연금 저축
export default {
  name: 'AnnunitySavings',
  render() {
    return (
      <ProductList
        path="annuity-savings"
        searchParams={{ topFinGrpNo: '060000', pageNo: '1' }}
      />
    );
  },
};
