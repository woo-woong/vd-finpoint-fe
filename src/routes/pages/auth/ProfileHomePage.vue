<script setup>
import TabHeader from '@/components/common/TabHeader.vue';
import ProfileInfoCard from '@/components/profile/ProfileInfoCard.vue';
import UserSubscribedProducts from '@/components/profile/UserSubscribedProducts.vue';
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

      <UserSubscribedProducts />
    </main>
  </div>
</template>
