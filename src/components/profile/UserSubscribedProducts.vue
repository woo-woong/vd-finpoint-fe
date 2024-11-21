<script setup>
import { ref } from 'vue';

// 사용자 정보와 가입한 상품 데이터
const subscribedProducts = ref([
  {
    id: 1,
    name: '삼성 적금 플랜',
    product_type: '적금',
    price: '월 30만원',
    subscribed_date: '2024-01-01',
    description: '1년 만기 고금리 적금 상품으로 연 3.5% 이자 제공.',
    isManaging: false,
  },
  {
    id: 2,
    name: 'KB 자유입출금 통장',
    product_type: '입출금 통장',
    price: '잔고 제한 없음',
    subscribed_date: '2024-02-15',
    description: '입출금이 자유로운 통장으로, 기본 금리 연 0.5% 제공.',
    isManaging: false,
  },
  {
    id: 3,
    name: '미래에셋 글로벌 주식 펀드',
    product_type: '펀드',
    price: '투자금액 500만원',
    subscribed_date: '2024-03-01',
    description: '글로벌 우량 주식에 투자하여 연평균 7% 수익률 목표.',
    isManaging: false,
  },
  {
    id: 4,
    name: '한화 연금저축보험',
    product_type: '연금',
    price: '월 20만원',
    subscribed_date: '2024-04-10',
    description: '노후 대비를 위한 세액공제 혜택 제공 연금 상품.',
    isManaging: false,
  },
  {
    id: 5,
    name: 'NH 농협 금리연동 대출',
    product_type: '대출',
    price: '대출금액 1억원',
    subscribed_date: '2024-05-20',
    description: '금리연동형 주택담보대출로, 최저 연 3.2% 금리 제공.',
    isManaging: false,
  },
]);

// 관리 모드 전체 토글
const isManagingAll = ref(false);

const toggleManageMode = () => {
  isManagingAll.value = !isManagingAll.value;
  subscribedProducts.value.forEach((product) => {
    product.isManaging = isManagingAll.value;
  });
};

// 관리 버튼 클릭 이벤트 (예: 관리 로직 추가)
const manageProduct = (id) => {
  alert(`상품 ID ${id} 관리 중`);
};
</script>

<template>
  <main class="flex flex-col items-center w-full max-w-4xl">
    <div class="w-full">
      <h2 class="mb-4 text-xl font-semibold">가입 상품 목록</h2>

      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        <div
          v-for="product in subscribedProducts"
          :key="product.id"
          class="relative p-4 transition duration-200 rounded-lg shadow bg-gray-50 hover:shadow-lg"
        >
          <!-- 상품 정보 -->
          <h3 class="mb-2 text-lg font-bold text-blue-600">
            {{ product.name }}
          </h3>
          <p class="text-sm text-gray-700">
            가격: <span class="font-semibold">{{ product.price }}</span>
          </p>
          <p class="text-sm text-gray-700">
            가입일:
            <span class="font-semibold">{{ product.subscribed_date }}</span>
          </p>
          <p class="mt-2 text-sm text-gray-600">
            {{ product.description }}
          </p>

          <!-- 관리 버튼: 관리 모드 활성화 시 나타남 -->
          <button
            v-if="product.isManaging"
            type="button"
            class="absolute p-2 text-white bg-red-500 rounded-full shadow-md top-2 right-2 hover:bg-red-600"
            @click="manageProduct(product.id)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-4 h-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M5.75 12h12.5"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- 상품 관리하기 버튼 -->
      <div class="flex justify-end w-full">
        <button
          type="button"
          class="px-6 py-2 text-sm font-semibold text-white transition duration-200 bg-green-500 rounded-lg shadow hover:bg-green-600"
          @click="toggleManageMode"
        >
          {{ isManagingAll ? '종료' : '상품 가입 관리' }}
        </button>
      </div>
    </div>
  </main>
</template>
