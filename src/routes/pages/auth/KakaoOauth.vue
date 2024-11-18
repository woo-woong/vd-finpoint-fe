<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Cookies from 'universal-cookie';
import ky from 'ky';

const router = useRouter();
const cookies = new Cookies();
const code = new URL(window.location.href).searchParams.get('code');

onMounted(async () => {
  if (code) {
    try {
      await ky.get(`http://localhost:8080/login/kakao?code=${code}`, {
        credentials: 'include',
      });

      const jwt = cookies.get('jwt');
      router.push('/');
    } catch (e) {
      console.error('토큰 요청 실패:', e);
      router.push('/');
    }
  }
});
</script>
