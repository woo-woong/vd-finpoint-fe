<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <header class="w-full bg-white shadow-md">
    <nav class="max-w-screen-xl px-6 py-4 mx-auto">
      <ul class="flex justify-between space-x-8 text-lg font-semibold">
        <RouterLink
          to="/"
          class="transition-colors cursor-pointer hover:text-blue-500"
        >
          FinPoint
        </RouterLink>
        <li class="flex space-x-8">
          <RouterLink
            to="/deposit"
            class="transition-colors cursor-pointer hover:text-blue-500"
          >
            정기예금
          </RouterLink>
          <RouterLink
            to="/savings"
            class="transition-colors cursor-pointer hover:text-blue-500"
          >
            적금
          </RouterLink>
          <RouterLink
            to="/annuity-savings"
            class="transition-colors cursor-pointer hover:text-blue-500"
          >
            연금 저축
          </RouterLink>
          <RouterLink
            to="/mortgage-loan"
            class="transition-colors cursor-pointer hover:text-blue-500"
          >
            주택담보대출
          </RouterLink>
          <RouterLink
            to="/rent-house-loan"
            class="transition-colors cursor-pointer hover:text-blue-500"
          >
            전세자금대출
          </RouterLink>
          <RouterLink
            to="/credit-loan"
            class="transition-colors cursor-pointer hover:text-blue-500"
          >
            개인신용대출
          </RouterLink>
        </li>
        <li class="flex gap-3">
          <RouterLink
            to="/logout"
            class="transition-colors cursor-pointer hover:text-blue-500"
          >
            로그아웃
          </RouterLink>
          <RouterLink
            to="/login"
            class="transition-colors cursor-pointer hover:text-blue-500"
          >
            로그인
          </RouterLink>
        </li>
      </ul>
    </nav>
  </header>
</template>
