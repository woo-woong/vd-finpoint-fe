<script setup>
import { ref, watch, computed, onMounted } from 'vue';
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

// 이메일 관련 상태
const emailId = ref(
  props.mode === 'edit' ? store.userData.email.split('@')[0] : ''
);
const emailDomain = ref(
  props.mode === 'edit' ? store.userData.email.split('@')[1] : ''
);
const selectedDomain = ref('직접입력');
const emailDomains = [
  '직접입력',
  'naver.com',
  'gmail.com',
  'daum.net',
  'hanmail.net',
  'nate.com',
  'kakao.com',
];

// 전화번호 관련 상태
const phoneFirst = ref(
  props.mode === 'edit' ? store.userData.phone.substring(0, 3) : ''
);
const phoneMiddle = ref(
  props.mode === 'edit' ? store.userData.phone.substring(3, 7) : ''
);
const phoneLast = ref(
  props.mode === 'edit' ? store.userData.phone.substring(7, 11) : ''
);

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

// 이메일 도메인 변경 처리
const handleDomainChange = (e) => {
  selectedDomain.value = e.target.value;
  if (e.target.value !== '직접입력') {
    emailDomain.value = e.target.value;
  } else {
    emailDomain.value = '';
  }
};

// 전화번호 변경 감시
watch([phoneFirst, phoneMiddle, phoneLast], () => {
  formData.value.phone = phoneFirst.value + phoneMiddle.value + phoneLast.value;
});

// 이메일 변경 감시
watch([emailId, emailDomain], () => {
  formData.value.email =
    emailId.value && emailDomain.value
      ? `${emailId.value}@${emailDomain.value}`
      : '';
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

// 오늘 날짜를 계산하여 최대값으로 설정
const today = new Date().toISOString().split('T')[0];

// 전화번호 관련 상태 초기화 로직 수정
const initializePhoneNumber = () => {
  if (props.mode === 'edit' && store.userData.phone) {
    // 모든 하이픈을 제거하고 숫자만 추출
    const cleanNumber = store.userData.phone.replace(/-/g, '');
    phoneFirst.value = cleanNumber.substring(0, 3);
    phoneMiddle.value = cleanNumber.substring(3, 7);
    phoneLast.value = cleanNumber.substring(7, 11);
  }
};

// 전화번호 조합 로직 수정
watch([phoneFirst, phoneMiddle, phoneLast], () => {
  if (phoneFirst.value && phoneMiddle.value && phoneLast.value) {
    // 숫자만 남기고 모두 제거
    const first = phoneFirst.value.replace(/\D/g, '');
    const middle = phoneMiddle.value.replace(/\D/g, '');
    const last = phoneLast.value.replace(/\D/g, '');
    formData.value.phone = `${first}${middle}${last}`;
  }
});

onMounted(() => {
  initializePhoneNumber();
});
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

        <!-- 이메일 입력 필드 -->
        <div class="mb-4">
          <label class="block mb-2 text-sm font-medium text-gray-700"
            >이메일</label
          >
          <div class="flex gap-2 items-center">
            <input
              type="text"
              v-model="emailId"
              class="flex-1 p-2 border rounded-md"
              placeholder="이메일"
            />
            <span class="text-gray-500">@</span>
            <input
              type="text"
              v-model="emailDomain"
              class="p-2 border rounded-md w-28"
              :disabled="selectedDomain !== '직접입력'"
              placeholder="도메인"
            />
            <select
              v-model="selectedDomain"
              @change="handleDomainChange"
              class="w-32 p-2 border rounded-md"
            >
              <option
                v-for="domain in emailDomains"
                :key="domain"
                :value="domain"
              >
                {{ domain }}
              </option>
            </select>
          </div>
        </div>

        <!-- 생월일 -->
        <SignUpFormInput
          label="생년월일"
          type="date"
          id="birth_date"
          name="birth_date"
          v-model="formData.birth_date"
          :disabled="isEditMode && !formData.birth_date"
          :max="today"
        />

        <!-- 전화번호 입력 필드 -->
        <div class="mb-4">
          <label class="block mb-2 text-sm font-medium text-gray-700"
            >전화번호</label
          >
          <div class="flex gap-2 items-center">
            <select
              v-model="phoneFirst"
              class="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            >
              <option value="010">010</option>
              <option value="011">011</option>
              <option value="016">016</option>
              <option value="017">017</option>
              <option value="018">018</option>
              <option value="019">019</option>
            </select>
            <span class="text-gray-500">-</span>
            <input
              v-model="phoneMiddle"
              type="text"
              maxlength="4"
              placeholder="0000"
              class="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              @input="
                $event.target.value = $event.target.value.replace(/[^0-9]/g, '')
              "
            />
            <span class="text-gray-500">-</span>
            <input
              v-model="phoneLast"
              type="text"
              maxlength="4"
              placeholder="0000"
              class="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              @input="
                $event.target.value = $event.target.value.replace(/[^0-9]/g, '')
              "
            />
          </div>
        </div>

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
          class="w-full px-4 py-2 mt-6 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          {{ submitButtonText }}
        </button>
      </form>
    </main>
  </div>
</template>
