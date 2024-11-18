<script setup>
// 여기에 필요한 로직이나 데이터 바인딩을 추가할 수 있습니다.
</script>

<template>
  <div class="flex flex-col items-center w-full min-h-screen bg-gray-100">
    <!-- 헤더 -->
    <header class="w-full py-5 text-center text-white bg-blue-600 shadow-md">
      <h1 class="text-2xl font-bold">내 프로필</h1>
      <p class="text-sm">나의 정보를 확인하고 관리할 수 있습니다.</p>
    </header>

    <!-- 프로필 콘텐츠 -->
    <main
      class="flex flex-col items-center w-full max-w-4xl px-6 py-10 mt-8 bg-white rounded-lg shadow-lg"
    >
      <!-- 프로필 사진 -->
      <div class="flex justify-center mb-6">
        <img
          src="https://via.placeholder.com/150"
          alt="프로필 사진"
          class="object-cover w-32 h-32 rounded-full"
        />
      </div>

      <!-- 프로필 정보 -->
      <div class="w-full mb-8">
        <h2 class="text-xl font-semibold">사용자 정보</h2>
        <div class="mt-4">
          <p class="text-sm text-gray-700">
            이름: <span class="font-semibold">홍길동</span>
          </p>
          <p class="text-sm text-gray-700">
            이메일: <span class="font-semibold">hong@example.com</span>
          </p>
          <p class="text-sm text-gray-700">
            가입일: <span class="font-semibold">2024-01-01</span>
          </p>
        </div>
      </div>

      <!-- 수정 버튼 -->
      <div class="flex justify-end w-full">
        <router-link to="/profile/edit">
          <button
            type="button"
            class="px-6 py-2 text-sm font-semibold text-white bg-green-500 rounded-lg shadow hover:bg-green-600"
          >
            프로필 수정
          </button>
        </router-link>
      </div>
    </main>
  </div>
</template>
