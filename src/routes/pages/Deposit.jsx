import ProductList from '@components/ProductList';

// 정기예금
export default {
  name: 'Deposit',
  render() {
    return (
      <ProductList
        path="deposit"
        searchParams={{ topFinGrpNo: '020000', pageNo: '1' }}
      />
    );
  },
};
