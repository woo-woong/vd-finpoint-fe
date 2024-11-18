import { createRouter, createWebHistory } from 'vue-router';
import BaseLayout from '@routes/layouts/BaseLayout.vue';
import Home from '@routes/pages/Home.vue';
import BoardHome from '@routes/pages/board/BoardHome.vue';
import PostDetail from '@routes/pages/board/PostDetail.vue';
import PostWrite from '@routes/pages/board/PostWrite.vue';
import PostEdit from '@routes/pages/board/PostEdit.vue';
import Deposit from '@routes/pages/finance/Deposit.vue';
import Savings from '@routes/pages/finance/Savings.vue';
import AnnunitySavings from '@routes/pages/finance/AnnuitySavings.vue';
import MortgageLoan from '@routes/pages/finance/MortgageLoan.vue';
import RentHouseLoan from '@routes/pages/finance/RentHouseLoan.vue';
import CreditLoan from '@routes/pages/finance/CreditLoan.vue';
import Login from '@routes/pages/auth/Login.vue';
import Logout from '@routes/pages/auth/Logout.vue';
import SignUp from '@routes/pages/auth/SignUp.vue';
import KakaoOauth from '@routes/pages/auth/KakaoOauth.vue';
import CurrencyCalculation from '@/components/currency/CurrencyCalculation.vue';
import KakaoMap from '@/components/external/KakaoMap.vue';
import ProfileHome from './pages/profile/ProfileHome.vue';
import ProfileEdit from './pages/profile/ProfileEdit.vue';

// 라우터 설정
const routes = [
  {
    path: '/',
    component: BaseLayout,
    children: [
      { path: '', component: Home },
      { path: '/board', component: BoardHome },
      {
        path: '/board/:id',
        name: 'PostDetail',
        component: PostDetail,
      },
      {
        path: '/board/new',
        name: 'PostWrite',
        component: PostWrite,
      },
      {
        path: '/board/1/edit',
        name: 'PostEdit',
        component: PostEdit,
      },
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
      { path: '/currency-calculation', component: CurrencyCalculation },
      { path: '/kakao-map', component: KakaoMap },
      { path: '/profile', component: ProfileHome },
      { path: '/profile/edit', component: ProfileEdit },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// router를 default로 내보냄
export default router;
