import { ref, watchEffect } from 'vue';

export const useCookie = (cookieName) => {
  // cookieName에 해당하는 쿠키 값을 저장할 ref 변수
  const cookieValue = ref(null);

  // 쿠키 값을 가져오는 함수
  const getCookie = () => {
    // 서버 사이드 렌더링(SSR)에서 실행되지 않도록 체크
    if (typeof document === 'undefined') return null;

    // 쿠키 이름에 '='을 붙여서 쿠키 값을 찾기 위한 문자열 준비
    const name = cookieName + '=';
    const decodedCookie = decodeURIComponent(document.cookie); // 쿠키 값 디코딩
    const cookieArray = decodedCookie.split(';'); // 쿠키들을 ';' 기준으로 분리

    // 각 쿠키들을 순회하면서 해당 쿠키 이름에 맞는 값을 찾기
    for (let cookie of cookieArray) {
      cookie = cookie.trim(); // 쿠키 앞뒤 공백 제거
      if (cookie.indexOf(name) === 0) {
        // 쿠키 이름이 일치하면 값을 반환
        return cookie.substring(name.length, cookie.length);
      }
    }
    return null; // 쿠키가 없으면 null 반환
  };

  // 쿠키 값을 설정하는 함수
  const setCookie = (value, options = {}) => {
    // 서버 사이드 렌더링(SSR)에서 실행되지 않도록 체크
    if (typeof document === 'undefined') return;

    // 쿠키 옵션 값 (기본값 포함)
    const {
      path = '/', // 쿠키의 유효 경로
      expires = '', // 만료일
      maxAge, // 쿠키의 유효 시간 (초 단위)
      domain, // 쿠키의 도메인
      secure, // HTTPS에서만 전송되는지 여부
      sameSite = 'Lax', // sameSite 옵션
    } = options;

    // 쿠키 문자열 생성
    let cookieString = `${cookieName}=${value}`;
    cookieString += `; path=${path}`;

    if (expires) cookieString += `; expires=${expires}`; // 만료일 설정
    if (maxAge) cookieString += `; max-age=${maxAge}`; // max-age 설정
    if (domain) cookieString += `; domain=${domain}`; // 도메인 설정
    if (secure) cookieString += '; secure'; // secure 설정
    if (sameSite) cookieString += `; samesite=${sameSite}`; // sameSite 설정

    // 쿠키를 document.cookie에 설정
    document.cookie = cookieString;

    // 쿠키 값을 반영
    cookieValue.value = value;
  };

  // 쿠키를 삭제하는 함수 (max-age를 -1로 설정하여 즉시 만료 처리)
  const removeCookie = () => {
    setCookie('', { maxAge: -1 });
  };

  // 쿠키 값이 변경되면 자동으로 반영되도록 watchEffect 사용
  watchEffect(() => {
    const value = getCookie();
    if (value !== cookieValue.value) {
      cookieValue.value = value; // 쿠키 값이 변경되면 cookieValue 업데이트
    }
  });

  return {
    value: cookieValue, // 쿠키 값을 읽기 위한 값
    setCookie, // 쿠키를 설정하는 함수
    removeCookie, // 쿠키를 삭제하는 함수
  };
};
