import { ref, watch } from 'vue';
import ky from 'ky';
import DaumAddress from '@components/DaumAddress';
import SignUpFormInput from '@components/SignUpFormInput';

export default {
  name: 'SignUpForm',
  setup() {
    const formData = ref({
      username: '',
      password: '',
      name: '',
      birthDate: '',
      email: '',
      phone: '',
      address: '',
      detailAddress: '',
    });

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      formData.value[name] = value;
    };

    const handleAddressChange = (value) => {
      if (typeof value === 'string') {
        formData.value.address = value;
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await ky.post(
          `${import.meta.env.VITE_FINANCIAL_API_URL}signup`,
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

    // Watch the address to reset the detailAddress
    watch(
      () => formData.value.address,
      () => {
        formData.value.detailAddress = '';
      }
    );

    return {
      formData,
      handleInputChange,
      handleAddressChange,
      handleSubmit,
    };
  },
  render() {
    return (
      <div class="flex justify-center w-full">
        <div class="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg">
          <h2 class="mb-6 text-2xl font-bold text-center">회원가입</h2>
          <form onSubmit={this.handleSubmit}>
            <SignUpFormInput
              label="아이디"
              type="text"
              id="username"
              name="username"
              value={this.formData.username}
              onChange={this.handleInputChange}
            />
            <SignUpFormInput
              label="비밀번호"
              type="password"
              id="password"
              name="password"
              value={this.formData.password}
              onChange={this.handleInputChange}
            />
            <SignUpFormInput
              label="이름"
              type="text"
              id="name"
              name="name"
              value={this.formData.name}
              onChange={this.handleInputChange}
            />
            <SignUpFormInput
              label="생년월일"
              type="date"
              id="birthDate"
              name="birthDate"
              value={this.formData.birthDate}
              onChange={this.handleInputChange}
            />
            <SignUpFormInput
              label="이메일"
              type="email"
              id="email"
              name="email"
              value={this.formData.email}
              onChange={this.handleInputChange}
            />
            <SignUpFormInput
              label="전화번호"
              type="tel"
              id="phone"
              name="phone"
              value={this.formData.phone}
              onChange={this.handleInputChange}
            />
            <div class="flex flex-col space-y-0">
              <SignUpFormInput
                label="주소"
                type="text"
                id="address"
                name="address"
                value={this.formData.address}
                onChange={this.handleInputChange}
                disabled
              />
              <SignUpFormInput
                label="상세 주소"
                type="text"
                id="detailAddress"
                name="detailAddress"
                value={this.formData.detailAddress}
                onChange={this.handleInputChange}
                disabled={this.formData.address.length === 0}
                required={false}
              />
              <DaumAddress setAddress={this.handleAddressChange} />
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
    );
  },
};
