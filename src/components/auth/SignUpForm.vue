<script setup>
import { ref, watch } from 'vue';
import ky from 'ky';
import DaumAddress from '@components/external/DaumAddress.vue';
import SignUpFormInput from '@components/auth/SignUpFormInput.vue';

const formData = ref({
  username: '',
  password: '',
  name: '',
  birth_date: '',
  email: '',
  phone: '',
  address: '',
  detail_address: '',
});

const handleAddressChange = (value) => {
  if (typeof value === 'string') {
    formData.value.address = value;
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();

  console.log('전송할 데이터:', formData.value);
  try {
    const response = await ky.post(
      `${import.meta.env.VITE_BACKEND_API_URL}signup/`,
      {
        json: formData.value,
      }
    );

    if (response.ok) {
      console.log('회원가입 성공');
    } else {
      console.error('회원가입 실패');
    }
  } catch (error) {
    console.error('에러 발생', error);
  }
};

// Watch the address to reset the detail_address
watch(
  () => formData.value.address,
  () => {
    formData.value.detail_address = '';
  }
);
</script>

<template>
  <div class="flex justify-center w-full">
    <div class="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg">
      <h2 class="mb-6 text-2xl font-bold text-center">회원가입</h2>
      <form @submit="handleSubmit">
        <SignUpFormInput
          label="아이디"
          type="text"
          id="username"
          name="username"
          v-model="formData.username"
        />
        <SignUpFormInput
          label="비밀번호"
          type="password"
          id="password"
          name="password"
          v-model="formData.password"
        />
        <SignUpFormInput
          label="이름"
          type="text"
          id="name"
          name="name"
          v-model="formData.name"
        />
        <SignUpFormInput
          label="생년월일"
          type="date"
          id="birth_date"
          name="birth_date"
          v-model="formData.birth_date"
        />
        <SignUpFormInput
          label="이메일"
          type="email"
          id="email"
          name="email"
          v-model="formData.email"
        />
        <SignUpFormInput
          label="전화번호"
          type="tel"
          id="phone"
          name="phone"
          v-model="formData.phone"
        />
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
        <button
          type="submit"
          class="w-full px-4 py-2 mt-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
        >
          회원가입
        </button>
      </form>
    </div>
  </div>
</template>
