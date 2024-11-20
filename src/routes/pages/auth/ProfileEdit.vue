<script setup>
import { ref } from 'vue';
import { profileService } from '@/services/profileService';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';

const router = useRouter();

// 사용자 정보 초기값 설정
const store = useUserStore();
const userData = store.userData;

// 수정 가능한 필드만 ref로 설정
const birth_date = ref(userData.birth_date);
const phone = ref(userData.phone);
const address = ref(userData.address);
const detail_address = ref(userData.detail_address);

// 폼 제출 처리 함수
// 새로고침 시 데이터 유지가 안되는 현상 해결 필요
const submitForm = () => {
  const updatedData = {
    birth_date: birth_date.value,
    phone: phone.value,
    address: address.value,
    detail_address: detail_address.value,
  };
  profileService()
    .editProfile(updatedData)
    .then(() => {
      // 스토어의 userData도 업데이트
      store.userData = { ...store.userData, ...updatedData };
      console.log('수정된 데이터:', updatedData);
      alert('수정이 완료되었습니다!');
      router.push('/profile');
    })
    .catch((error) => {
      console.error('프로필 수정 중 오류 발생:', error);
      alert('수정에 실패했습니다. 다시 시도해주세요.');
    });
};
</script>

<template>
  <div class="flex flex-col items-center w-full min-h-screen bg-gray-100">
    <!-- 헤더 -->
    <header class="w-full py-5 text-center text-white bg-blue-600 shadow-md">
      <h1 class="text-2xl font-bold">프로필 수정</h1>
      <p class="text-sm">수정 가능한 정보만 변경할 수 있습니다.</p>
    </header>

    <!-- 수정 폼 -->
    <main
      class="flex flex-col items-center w-full max-w-4xl px-6 py-10 mt-8 bg-white rounded-lg shadow-lg"
    >
      <div class="w-full mb-8">
        <h2 class="text-xl font-semibold">사용자 정보</h2>

        <!-- 읽기 전용 필드 -->
        <div class="mt-4">
          <label class="block text-sm text-gray-700">사용자 아이디</label>
          <input
            type="text"
            :value="userData.username"
            disabled
            class="w-full px-4 py-2 mt-2 bg-gray-100 border border-gray-300 rounded-lg"
          />
        </div>

        <div class="mt-4">
          <label class="block text-sm text-gray-700">이메일</label>
          <input
            type="email"
            :value="userData.email"
            disabled
            class="w-full px-4 py-2 mt-2 bg-gray-100 border border-gray-300 rounded-lg"
          />
        </div>

        <div class="mt-4">
          <label class="block text-sm text-gray-700">이름</label>
          <input
            type="text"
            :value="userData.name"
            disabled
            class="w-full px-4 py-2 mt-2 bg-gray-100 border border-gray-300 rounded-lg"
          />
        </div>

        <!-- 수정 가능한 필드 -->
        <div class="mt-4">
          <label class="block text-sm text-gray-700">생년월일</label>
          <input
            type="date"
            v-model="birth_date"
            class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div class="mt-4">
          <label class="block text-sm text-gray-700">전화번호</label>
          <input
            type="tel"
            v-model="phone"
            class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg"
            placeholder="전화번호를 입력하세요"
          />
        </div>

        <div class="mt-4">
          <label class="block text-sm text-gray-700">주소</label>
          <input
            type="text"
            v-model="address"
            class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg"
            placeholder="주소를 입력하세요"
          />
        </div>

        <div class="mt-4">
          <label class="block text-sm text-gray-700">상세주소</label>
          <input
            type="text"
            v-model="detail_address"
            class="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg"
            placeholder="상세주소를 입력하세요"
          />
        </div>

        <!-- 수정 버튼 -->
        <div class="flex justify-end w-full mt-6">
          <button
            type="button"
            @click="submitForm"
            class="px-6 py-2 text-sm font-semibold text-white bg-green-500 rounded-lg shadow hover:bg-green-600"
          >
            수정 완료
          </button>
        </div>
      </div>
    </main>
  </div>
</template>
