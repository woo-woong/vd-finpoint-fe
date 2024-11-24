<script setup>
import { finProductService } from '@services/finProductService';
import { computed, ref } from 'vue';
import { toast } from 'vue-sonner';
import { Progress } from '@/components/ui/progress';

const emit = defineEmits(['update:subscribed']);
const isLoading = ref(false);
const progress = ref(0);

const loadingMessages = [
  '열심히 가입 처리 중입니다...',
  '핀피가 고객님을 위해 금융 상품을 낚고 있습니다 🎣',
  '고객님의 소중한 자산을 위해 꼼꼼히 확인하고 있습니다 ✨',
  '잠시만 기다려주세요, 거의 다 됐어요! 📈',
];

const unsubscribeLoadingMessages = [
  '가입 취소를 처리하고 있습니다...',
  '고객님의 요청을 처리중입니다 📝',
  '안전하게 취소 처리를 진행하고 있어요 ⚡️',
  '조금만 더 기다려주세요! 🔄',
];

const currentMessage = ref(loadingMessages[0]);

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

const simulateProgress = (isUnsubscribing = false) => {
  progress.value = isUnsubscribing ? 100 : 0;
  const messages = isUnsubscribing
    ? unsubscribeLoadingMessages
    : loadingMessages;
  let currentMessageIndex = 0;

  // 3.5초를 4등분하여 각 메시지가 표시되는 시간을 계산 (약 875ms)
  const messageInterval = setInterval(() => {
    currentMessageIndex = (currentMessageIndex + 1) % messages.length;
    currentMessage.value = messages[currentMessageIndex];
  }, 875);

  // 3.5초 동안 0에서 100까지(또는 100에서 0까지) 진행
  const totalSteps = 100;
  const stepTime = 3500 / totalSteps; // 각 스텝당 시간 (35ms)

  const interval = setInterval(() => {
    if (isUnsubscribing) {
      if (progress.value <= 0) {
        clearInterval(interval);
        clearInterval(messageInterval);
        return;
      }
      progress.value -= 1;
    } else {
      if (progress.value >= 100) {
        clearInterval(interval);
        clearInterval(messageInterval);
        return;
      }
      progress.value += 1;
    }
  }, stepTime);

  return { progressInterval: interval, messageInterval };
};

const subscribe = async () => {
  if (isLoading.value) return;

  try {
    isLoading.value = true;
    if (productDetails.value) {
      if (!isSubscribed.value) {
        const { progressInterval, messageInterval } = simulateProgress(false);
        currentMessage.value = loadingMessages[0];
        const response = await subscribeFinProduct(productDetails.value);
        await new Promise((resolve) => setTimeout(resolve, 4000));
        clearInterval(progressInterval);
        clearInterval(messageInterval);
        progress.value = 100;

        wishlistId.value = response.id;
        isSubscribed.value = true;
        emit('update:subscribed', true);
        toast.success('상품 가입이 완료되었습니다!', {
          style: {
            background: '#dcfce7',
            color: '#16a34a',
            border: '1px solid #16a34a',
          },
        });
      } else {
        const { progressInterval, messageInterval } = simulateProgress(true);
        currentMessage.value = unsubscribeLoadingMessages[0];
        if (wishlistId.value) {
          await unsubscribeFinProduct(productDetails.value, wishlistId.value);
          await new Promise((resolve) => setTimeout(resolve, 4000));
          clearInterval(progressInterval);
          clearInterval(messageInterval);
          progress.value = 100;

          isSubscribed.value = false;
          wishlistId.value = null;
          emit('update:subscribed', false);
          toast.success('상품 가입이 취소되었습니다.', {
            style: {
              background: '#dcfce7',
              color: '#16a34a',
              border: '1px solid #16a34a',
            },
          });
        }
      }
    }
  } catch (error) {
    progress.value = 0;
    toast.error('처리 중 오류가 발생했습니다.', {
      style: {
        background: '#fee2e2',
        color: '#dc2626',
        border: '1px solid #dc2626',
      },
    });
    isSubscribed.value = props.initialIsSubscribed;
  } finally {
    isLoading.value = false;
    setTimeout(() => {
      progress.value = 0;
    }, 500);
  }
};
</script>

<template>
  <div class="relative">
    <!-- 로딩 오버레이 -->
    <div
      v-if="isLoading"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
    >
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0 }"
        :exit="{ opacity: 0, y: -20 }"
        class="p-8 bg-white rounded-lg shadow-xl w-[500px]"
      >
        <div class="space-y-6">
          <Progress :modelValue="progress" />
          <p
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0 }"
            :exit="{ opacity: 0, y: -20 }"
            :key="currentMessage"
            class="text-center text-gray-700 font-medium"
          >
            {{ currentMessage }}
          </p>
        </div>
      </div>
    </div>

    <!-- 버튼 -->
    <button
      v-if="productDetails && !isSubscribed"
      class="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50"
      @click="subscribe"
      :disabled="isLoading"
    >
      가입하기
    </button>
    <button
      v-if="isSubscribed"
      class="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 disabled:opacity-50"
      @click="subscribe"
      :disabled="isLoading"
    >
      가입 취소
    </button>
  </div>
</template>
