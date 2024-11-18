export default {
  name: 'Card',
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { korCoNm, finPrdtNm, joinWay, mtrtInt } = props.product;

    return () => (
      <div class="max-w-sm p-6 mx-auto bg-white border border-gray-200 rounded-lg shadow-lg min-w-40">
        <div class="space-y-4">
          {/* korCoNm */}
          <div class="text-sm text-gray-500">금융회사 명</div>
          <div class="text-xl font-semibold text-gray-800">{korCoNm}</div>

          {/* finPrdtNm */}
          <div class="text-sm text-gray-500">금융상품 명</div>
          <div class="text-xl font-semibold text-gray-800">{finPrdtNm}</div>

          {/* joinWay */}
          <div class="text-sm text-gray-500">가입 방법</div>
          <div class="text-lg text-gray-800">{joinWay}</div>

          {/* mtrInt */}
          <div class="text-sm text-gray-500">만기 후 이자율</div>
          <div class="text-lg text-gray-800">{mtrtInt}</div>
        </div>
      </div>
    );
  },
};
