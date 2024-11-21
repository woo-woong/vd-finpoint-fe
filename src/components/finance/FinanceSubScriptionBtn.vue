<script setup>
import { finProductService } from '@services/finProductService';
import { computed, ref } from 'vue';

const emit = defineEmits(['update:subscribed']);

const props = defineProps({
  product: {
    type: Object,
    default: null,
  },
  service: {
    type: String,
    required: true,
  },
  initialIsSubscribed: {
    type: Boolean,
    required: true,
  },
  inititalWishlistId: {
    type: Number,
    default: null,
  },
});

const { subscribeFinProduct, unsubscribeFinProduct } = finProductService();
const isSubscribed = ref(props.initialIsSubscribed);
const wishlistId = ref(props.inititalWishlistId);

const productDetails = computed(() =>
  props.product
    ? {
        fin_prdt_cd: props.product.fin_prdt_cd,
        kor_co_nm: props.product.kor_co_nm,
        fin_prdt_nm: props.product.fin_prdt_nm,
        mtrt_int: props.product.mtrt_int,
        type: props.service.toUpperCase(), // 백엔드에서 대문자로 요구
      }
    : null
);

const subscribe = async () => {
  try {
    if (productDetails.value) {
      if (!isSubscribed.value) {
        // 가입(찜하기) 로직
        const response = await subscribeFinProduct(productDetails.value);
        wishlistId.value = response.id;
        isSubscribed.value = true;
        emit('update:subscribed', true);
      } else {
        // 가입 취소(찜 해제) 로직
        if (wishlistId.value) {
          // 응답을 기다리되, 빈 응답도 허용
          await unsubscribeFinProduct(productDetails.value, wishlistId.value);
          isSubscribed.value = false;
          wishlistId.value = null;
          emit('update:subscribed', false);
        } else {
          console.error('위시리스트 ID를 찾을 수 없습니다.');
        }
      }
    } else {
      console.error('선택된 상품이 없습니다');
    }
  } catch (error) {
    console.error('구독/구독 취소 실패:', error);
    // 에러 발생 시 이전 상태로 되돌리기
    isSubscribed.value = props.initialIsSubscribed;
  }
};
</script>

<template>
  <button
    v-if="productDetails && !isSubscribed"
    class="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
    @click="subscribe"
  >
    가입하기
  </button>
  <button
    v-if="isSubscribed"
    class="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
    @click="subscribe"
  >
    가입 취소
  </button>
</template>
