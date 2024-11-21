<script setup>
import { onMounted, ref, computed } from 'vue';
import Loading from '@/components/common/Loading.vue';
import TabHeader from '@/components/common/TabHeader.vue';
import ProfileInfoCard from '@/components/profile/ProfileInfoCard.vue';
import SubscribedProductsList from '@/components/profile/SubscribedProductsList.vue';
import { profileService } from '@/services/profileService';
import SubscribedProductInterestGraph from '@/components/profile/SubscribedProductInterestGraph.vue';

const { getProfile } = profileService();

const isLoading = ref(true);
const subscribedProducts = ref(null);
const processedGraphData = computed(() => {
  if (!subscribedProducts.value) return [];

  return subscribedProducts.value.flatMap((product) =>
    product.product_detail.options.map((option) => ({
      fin_prdt_cd: product.fin_prdt_cd,
      fin_prdt_nm: product.fin_prdt_nm,
      save_trm: option.save_trm,
      intr_rate: option.intr_rate,
    }))
  );
});

const fetchProfile = async () => {
  try {
    const data = await getProfile();
    subscribedProducts.value = data.wishlist;
    console.log(subscribedProducts);
  } catch (error) {
    console.error('프로필 데이터를 가져오는 데 실패했습니다', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchProfile);
</script>

<template>
  <div class="flex flex-col items-center w-full min-h-screen bg-gray-100">
    <!-- 헤더 -->
    <TabHeader
      title="내 프로필"
      subtitle="나의 정보를 확인하고 관리할 수 있습니다."
    />
    <!-- 프로필 콘텐츠 -->
    <main
      class="flex flex-col items-center w-full max-w-4xl px-6 py-10 mt-8 bg-white rounded-lg shadow-lg"
    >
      <!-- 프로필 정보 -->
      <div class="w-full mb-8">
        <h2 class="mb-4 text-xl font-semibold">사용자 정보</h2>

        <!-- 기본 정보 -->
        <ProfileInfoCard infoTitle="기본 정보" />

        <!-- 추가 정보 -->
        <ProfileInfoCard infoTitle="추가 정보" />
      </div>

      <!-- 수정 버튼 -->
      <div class="flex justify-end w-full">
        <router-link to="/profile/edit">
          <button
            type="button"
            class="px-6 py-2 text-sm font-semibold text-white transition duration-200 bg-green-500 rounded-lg shadow hover:bg-green-600"
          >
            프로필 수정
          </button>
        </router-link>
      </div>
      <!-- 가입 상품 목록 -->
      <main class="flex flex-col items-center w-full max-w-4xl">
        <div class="w-full">
          <h2 class="mb-4 text-xl font-semibold">가입 상품 목록</h2>
          <Loading v-if="isLoading" />
          <SubscribedProductsList
            v-else
            :subscribedProducts="subscribedProducts"
          />
        </div>
      </main>
      <!-- 가입 상품 그래프 -->
      <main class="flex flex-col items-center w-full max-w-4xl">
        <div class="w-full">
          <h2 class="mb-4 text-xl font-semibold">가입 상품 그래프</h2>
          <Loading v-if="isLoading" />
          <SubscribedProductInterestGraph
            v-else
            :options="processedGraphData"
          />
        </div>
      </main>
    </main>
  </div>
</template>
