<script setup>
import { RouterLink } from 'vue-router';
</script>
<template>
  <footer class="w-full text-gray-300 bg-slate-900">
    <div class="px-4 py-12 mx-auto max-w-7xl">
      <!-- 메인 푸터 콘텐츠 -->
      <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
        <!-- 회사 정보 -->
        <div>
          <h3 class="mb-4 font-bold text-white">FinPoint</h3>
          <p class="text-sm">© 2024 FinPoint</p>
          <p class="mt-2 text-sm">All rights reserved.</p>
        </div>

        <!-- 서비스 -->
        <div>
          <h3 class="mb-4 font-bold text-white">서비스</h3>
          <ul class="space-y-2 text-sm">
            <li>
              <router-link
                to="/deposit"
                class="hover:text-white"
                @click="() => window.scrollTo({ top: 0, behavior: 'smooth' })"
                >정기예금</router-link
              >
            </li>
            <li>
              <router-link
                to="/savings"
                class="hover:text-white"
                @click="() => window.scrollTo({ top: 0, behavior: 'smooth' })"
                >적금</router-link
              >
            </li>
          </ul>
        </div>

        <!-- 연락처 -->
        <div>
          <h3 class="mb-4 font-bold text-white">연락처</h3>
          <ul class="space-y-2 text-sm">
            <li>고객센터: 1588-0000</li>
            <li>평일 09:00 - 18:00</li>
            <li>이메일: support@finpoint.com</li>
          </ul>
        </div>
      </div>

      <!-- 하단 정보 -->
      <div class="pt-8 mt-8 text-sm text-gray-400 border-t border-gray-700">
        <p>FinPoint | 대표: 싸피 | 사업자등록번호: 123-45-67890</p>
        <p class="mt-2">경북 구미시 3공단 3로 302 구미 캠퍼스 2반</p>
        <p class="mt-4">Developed by Team woo-woong</p>
      </div>
    </div>
  </footer>
</template>
