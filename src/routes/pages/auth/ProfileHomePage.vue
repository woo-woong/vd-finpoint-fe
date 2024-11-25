<script setup>
import { onMounted, ref, computed } from 'vue';
import TabHeader from '@/components/common/TabHeader.vue';
import ProfileInfoCard from '@/components/profile/ProfileInfoCard.vue';
import SubscribedProductsList from '@/components/profile/SubscribedProductsList.vue';
import { profileService } from '@/services/profileService';
import SubscribedProductInterestGraph from '@/components/profile/SubscribedProductInterestGraph.vue';
import SectionLoading from '@/components/common/SectionLoading.vue';
import { toast } from 'vue-sonner';

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
    console.log(subscribedProducts.value);
  } catch (error) {
    toast.error(
      '프로필 데이터를 가져오는 데 실패했습니다. 새로고침 후 다시 시도해주세요.',
      {
        style: {
          background: '#fee2e2',
          color: '#dc2626',
          width: '350px',
        },
      }
    );
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchProfile);
</script>

<template>
  <div class="flex flex-col items-center w-full min-h-screen pb-5 bg-gray-100">
    <!-- 헤더 -->
    <TabHeader
      title="내 프로필"
      subtitle="나의 정보를 확인하고 관리할 수 있습니다."
    />
    <!-- 프로필 콘텐츠 -->
    <main
      class="flex flex-col items-center w-full max-w-4xl px-6 py-8 mt-8 bg-white rounded-lg shadow-lg"
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

      <div class="w-full my-6">
        <hr class="w-full h-px bg-gray-300 border-0" />
      </div>

      <!-- 가입 상품 목록 -->
      <main class="flex flex-col items-center w-full max-w-4xl mb-5">
        <div class="w-full">
          <SectionLoading
            v-if="isLoading"
            message="목록을 불러오는 중입니다..."
          />
          <SubscribedProductsList
            v-else-if="subscribedProducts && subscribedProducts.length > 0"
            :subscribedProducts="subscribedProducts"
          />
          <div v-else class="text-center py-8 text-gray-500">
            가입한 상품이 없거나 데이터를 불러오지 못했습니다.
          </div>
        </div>
      </main>
      <!-- 가입 상품 그래프 -->
      <main class="flex flex-col items-center w-full max-w-4xl h-[420px]">
        <div class="w-full">
          <SectionLoading
            v-if="isLoading"
            message="그래프를 불러오는 중입니다..."
          />
          <SubscribedProductInterestGraph
            v-else-if="subscribedProducts && subscribedProducts.length > 0"
            :options="processedGraphData"
          />
          <div v-else class="text-center py-8 text-gray-500">
            표시할 그래프 데이터가 없습니다.
          </div>
        </div>
      </main>
    </main>
  </div>
</template>
