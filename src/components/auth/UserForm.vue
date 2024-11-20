<script setup>
import { ref, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { profileService } from '@/services/profileService';
import DaumAddress from '@components/external/DaumAddress.vue';
import SignUpFormInput from '@components/auth/SignUpFormInput.vue';
import ky from 'ky';

const props = defineProps({
  mode: {
    type: String,
    validator: (value) => ['signup', 'edit'].includes(value),
    required: true,
  },
});

const router = useRouter();
const store = useUserStore();

// 폼 데이터 초기화
const formData = ref({
  username: props.mode === 'edit' ? store.userData.username : '',
  password: '',
  name: props.mode === 'edit' ? store.userData.name : '',
  birth_date: props.mode === 'edit' ? store.userData.birth_date : '',
  email: props.mode === 'edit' ? store.userData.email : '',
  phone: props.mode === 'edit' ? store.userData.phone : '',
  address: props.mode === 'edit' ? store.userData.address : '',
  detail_address: props.mode === 'edit' ? store.userData.detail_address : '',
});

// 계산된 속성
const pageTitle = computed(() =>
  props.mode === 'signup' ? '회원가입' : '프로필 수정'
);
const submitButtonText = computed(() =>
  props.mode === 'signup' ? '회원가입' : '수정 완료'
);
const isEditMode = computed(() => props.mode === 'edit');

// 주소 처리
const handleAddressChange = (value) => {
  if (typeof value === 'string') {
    formData.value.address = value;
  }
};

// 폼 제출 처리
const handleSubmit = async (e) => {
  if (e) e.preventDefault();

  try {
    if (props.mode === 'signup') {
      await ky.post(`${import.meta.env.VITE_BACKEND_API_URL}signup/`, {
        json: formData.value,
      });
      router.push('/login');
    } else {
      const updatedData = {
        birth_date: formData.value.birth_date,
        phone: formData.value.phone,
        address: formData.value.address,
        detail_address: formData.value.detail_address,
      };
      await profileService().editProfile(updatedData);
      store.userData = { ...store.userData, ...updatedData };
      router.push('/profile');
    }
    alert(
      props.mode === 'signup'
        ? '회원가입이 완료되었습니다!'
        : '수정이 완료되었습니다!'
    );
  } catch (error) {
    console.error(
      props.mode === 'signup' ? '회원가입 실패:' : '프로필 수정 실패:',
      error
    );
    alert('처리에 실패했습니다. 다시 시도해주세요.');
  }
};

// 주소 변경 시 상세주소 초기화
watch(
  () => formData.value.address,
  () => {
    formData.value.detail_address = '';
  }
);
</script>

<template>
  <div class="flex flex-col items-center w-full min-h-screen bg-gray-100">
    <!-- 헤더 -->
    <header class="w-full py-5 text-center text-white bg-blue-600 shadow-md">
      <h1 class="text-2xl font-bold">{{ pageTitle }}</h1>
      <p class="text-sm">
        {{
          isEditMode
            ? '수정 가능한 정보만 변경할 수 있습니다.'
            : '회원 정보를 입력해주세요.'
        }}
      </p>
    </header>

    <!-- 폼 -->
    <main
      class="flex flex-col items-center w-full max-w-4xl px-6 py-10 mt-8 bg-white rounded-lg shadow-lg"
    >
      <form @submit="handleSubmit" class="w-full max-w-lg">
        <!-- 회원가입 시에만 보이는 필드들 -->
        <SignUpFormInput
          label="아이디"
          type="text"
          id="username"
          name="username"
          v-model="formData.username"
          :disabled="isEditMode"
        />
        <SignUpFormInput
          label="비밀번호"
          type="password"
          id="password"
          name="password"
          v-model="formData.password"
          :disabled="isEditMode"
        />
        <SignUpFormInput
          label="이름"
          type="text"
          id="name"
          name="name"
          v-model="formData.name"
          :disabled="isEditMode"
        />
        <SignUpFormInput
          label="이메일"
          type="email"
          id="email"
          name="email"
          v-model="formData.email"
        />

        <!-- 공통 필드들 -->
        <SignUpFormInput
          label="생년월일"
          type="date"
          id="birth_date"
          name="birth_date"
          v-model="formData.birth_date"
          :disabled="isEditMode && !formData.birth_date"
        />
        <SignUpFormInput
          label="전화번호"
          type="tel"
          id="phone"
          name="phone"
          v-model="formData.phone"
        />

        <!-- 주소 관련 필드들 -->
        <div class="flex flex-col space-y-0">
          <SignUpFormInput
            label="주소"
            type="text"
            id="address"
            name="address"
            v-model="formData.address"
            :disabled="true"
          />
          <SignUpFormInput
            label="상세 주소"
            type="text"
            id="detail_address"
            name="detail_address"
            v-model="formData.detail_address"
            :disabled="formData.address.length === 0"
            :required="false"
          />
          <DaumAddress :setAddress="handleAddressChange" />
        </div>

        <!-- 제출 버튼 -->
        <button
          type="submit"
          class="w-full px-4 py-2 mt-6 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {{ submitButtonText }}
        </button>
      </form>
    </main>
  </div>
</template>
