import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import DefaultLayout from '@routes/layouts/Default';
import Home from '@routes/pages/Home';
import Deposit from '@routes/pages/Deposit';
import Savings from '@routes/pages/Savings';
import AnnunitySavings from '@routes/pages/AnnuitySavings';
import MortgageLoan from '@routes/pages/MortgageLoan';
import RentHouseLoan from '@routes/pages/RentHouseLoan';
import CreditLoan from '@routes/pages/CreditLoan';
import Login from '@routes/pages/Login';
import Logout from '@routes/pages/Logout';
import SignUp from '@routes/pages/SignUp';
import KakaoOauth from '@routes/pages/KakaoOauth';

// 라우터 설정
const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', component: Home },
      { path: '/deposit', component: Deposit },
      { path: '/savings', component: Savings },
      { path: '/annuity-savings', component: AnnunitySavings },
      { path: '/mortgage-loan', component: MortgageLoan },
      { path: '/rent-house-loan', component: RentHouseLoan },
      { path: '/credit-loan', component: CreditLoan },
      { path: '/login', component: Login },
      { path: '/logout', component: Logout },
      { path: '/signup', component: SignUp },
      { path: '/login/oauth2/code/kakao/', component: KakaoOauth },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// router를 default로 내보냄
export default router;
