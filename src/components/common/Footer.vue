<script setup>
import { RouterLink } from 'vue-router';
</script>
<template>
  <footer class="w-full bg-slate-900 text-gray-300">
    <div class="max-w-7xl mx-auto px-4 py-12">
      <!-- 메인 푸터 콘텐츠 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- 회사 정보 -->
        <div>
          <h3 class="text-white font-bold mb-4">FinPoint</h3>
          <p class="text-sm">© 2024 FinPoint</p>
          <p class="text-sm mt-2">All rights reserved.</p>
        </div>

        <!-- 서비스 -->
        <div>
          <h3 class="text-white font-bold mb-4">서비스</h3>
          <ul class="text-sm space-y-2">
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
          <h3 class="text-white font-bold mb-4">연락처</h3>
          <ul class="text-sm space-y-2">
            <li>고객센터: 1588-0000</li>
            <li>평일 09:00 - 18:00</li>
            <li>이메일: support@finpoint.com</li>
          </ul>
        </div>
      </div>

      <!-- 하단 정보 -->
      <div class="mt-8 pt-8 border-t border-gray-700 text-sm text-gray-400">
        <p>FinPoint | 대표: 싸피 | 사업자등록번호: 123-45-67890</p>
        <p class="mt-2">경북 구미시 3공단 3로 302 구미 캠퍼스 2반</p>
        <p class="mt-4">Developed by Team woo-woong</p>
      </div>
    </div>
  </footer>
</template>
