import ProductList from '@components/ProductList';

// 개인신용대출
export default {
  name: 'CreditLoan',
  render() {
    return (
      <ProductList
        path="credit-loan"
        searchParams={{ topFinGrpNo: '020000', pageNo: '1' }}
      />
    );
  },
};
