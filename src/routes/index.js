import { createRouter, createWebHistory } from 'vue-router';
import BaseLayout from '@routes/layouts/BaseLayout.vue';
import HomePage from '@routes/pages/HomePage.vue';
import BoardHomePage from '@routes/pages/board/BoardHomePage.vue';
import PostDetailPage from '@routes/pages/board/PostDetailPage.vue';
import PostEditorPage from '@routes/pages/board/PostEditorPage.vue';
import FinProductDetailPage from '@routes/pages/finance/FinProductDetailPage.vue';
import DepositPage from '@routes/pages/finance/DepositPage.vue';
import SavingsPage from '@routes/pages/finance/SavingsPage.vue';
import AnnunitySavings from '@routes/pages/finance/AnnuitySavings.vue';
import MortgageLoan from '@routes/pages/finance/MortgageLoan.vue';
import RentHouseLoan from '@routes/pages/finance/RentHouseLoan.vue';
import CreditLoan from '@routes/pages/finance/CreditLoan.vue';
import LoginPage from '@routes/pages/auth/LoginPage.vue';
import LogoutPage from '@routes/pages/auth/LogoutPage.vue';
import SignUpPage from '@routes/pages/auth/SignUpPage.vue';
import KakaoOauth from '@routes/pages/auth/KakaoOauth.vue';
import ProfileHomePage from '@routes/pages/auth/ProfileHomePage.vue';
import ProfileEditPage from '@routes/pages/auth/ProfileEditPage.vue';
import NearestBankPage from '@routes/pages/external/NearestBankPage.vue';
import ExchangeRateCalculatorPage from '@routes/pages/external/ExchangeRateCalculatorPage.vue';
import { useCookie } from '@/hooks/auth/useCookie';

const requireAuth = (to, from, next) => {
  const sessionId = useCookie('sessionid');
  if (sessionId) {
    next();
  } else {
    next('/login');
  }
};
// 로그인되지 않은 상태 체크
// Cookie를 직접 읽는 방식으로 변경
const requireNonAuth = (to, from, next) => {
  // 쿠키를 직접 파싱하는 함수
  const sessionId = useCookie('sessionid');

  if (sessionId) {
    next('/'); // 이미 로그인된 경우 홈으로 리다이렉트
  } else {
    next();
  }
};

// 라우터 설정
const routes = [
  {
    path: '/',
    component: BaseLayout,
    children: [
      { path: '', component: HomePage },
      { path: '/board', component: BoardHomePage },
      {
        path: '/board/:id',
        name: 'PostDetail',
        component: PostDetailPage,
      },
      {
        path: '/board/new',
        name: 'PostWrite',
        component: PostEditorPage,
        props: { mode: 'create' },
        beforeEnter: requireAuth,
      },
      {
        path: '/board/:id/edit',
        name: 'PostEdit',
        component: PostEditorPage,
        props: { mode: 'edit' },
        beforeEnter: requireAuth,
      },
      {
        path: '/:service/detail',
        name: 'FinProductDetailPage',
        component: FinProductDetailPage,
        props: true,
        beforeEnter: (to, from, next) => {
          const validServices = [
            'deposit',
            'savings',
            'annuity-savings',
            'mortgage-loan',
            'rent-house-loan',
            'credit-loan',
          ];
          if (validServices.includes(to.params.service)) {
            next();
          } else {
            next('/');
          }
        },
      },
      { path: '/deposit', component: DepositPage },
      { path: '/savings', component: SavingsPage },
      { path: '/annuity-savings', component: AnnunitySavings },
      { path: '/mortgage-loan', component: MortgageLoan },
      { path: '/rent-house-loan', component: RentHouseLoan },
      { path: '/credit-loan', component: CreditLoan },
      { path: '/login', component: LoginPage, beforeEnter: requireNonAuth },
      { path: '/logout', component: LogoutPage },
      { path: '/signup', component: SignUpPage, beforeEnter: requireNonAuth },
      { path: '/login/oauth2/code/kakao/', component: KakaoOauth },
      { path: '/find-nearest-bank', component: NearestBankPage },
      {
        path: '/calculate-exchange-rate',
        component: ExchangeRateCalculatorPage,
      },
      {
        path: '/profile',
        component: ProfileHomePage,
        beforeEnter: requireAuth,
      },
      {
        path: '/profile/edit',
        component: ProfileEditPage,
        beforeEnter: requireAuth,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }; // 항상 페이지 상단으로 스크롤
  },
});

export default router;
