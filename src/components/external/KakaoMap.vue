<template>
  <!-- 지도를 포함할 전체 컨테이너. 최소 높이 500px로 설정 -->
  <div class="w-full h-full min-h-[500px]">
    <!-- 실제 지도가 렌더링될 div. ref를 사용해 Vue에서 DOM 요소에 접근 -->
    <div ref="mapContainer" class="w-full h-full min-h-[500px]"></div>
    
    <!-- 은행 목록 섹션. banks 배열에 데이터가 있을 때만 보임 -->
    <div v-if="banks.length" class="mt-4">
      <h2 class="text-xl font-bold mb-2">근처 은행 목록</h2>
      <ul>
        <!-- 클릭 이벤트 추가하여 지도 이동 및 마커 강조 -->
        <li 
          v-for="bank in banks" 
          :key="bank.id" 
          class="mb-2 p-2 border rounded cursor-pointer hover:bg-gray-100"
          @click="navigateToBank(bank)"
        >
          {{ bank.place_name }} - 거리: {{ bank.distance }}m
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
// Vue 및 Axios 라이브러리 import
import { ref, onMounted, reactive } from 'vue';
import axios from 'axios';

// Refs 및 반응형 변수 선언
const mapContainer = ref(null);    // 지도 컨테이너 DOM 요소
const map = ref(null);             // Kakao Map 인스턴스
const banks = ref([]);             // 근처 은행 목록
const infoWindows = ref([]);       // 열린 인포윈도우 관리
const bankMarkers = ref([]);       // 은행 마커들 저장
const userLocationMarker = ref(null);  // 사용자 위치 마커

// 지도 초기 옵션 설정 (반응형)
const mapOptions = reactive({
  center: { lat: 37.5665, lng: 126.9780 }, // 서울 중심 좌표 (기본값)
  level: 5 // 지도 확대 레벨
});

// 지도 이동 및 마커 강조 함수
const navigateToBank = (bank) => {
  if (!map.value) return;

  // 지도 중심을 선택한 은행 위치로 이동
  const bankPosition = new window.kakao.maps.LatLng(bank.y, bank.x);
  map.value.setCenter(bankPosition);
  map.value.setLevel(3); // 더 가깝게 확대

  // 모든 인포윈도우 닫기
  infoWindows.value.forEach(iw => iw.close());

  // 선택한 은행의 마커 찾기
  const selectedMarker = bankMarkers.value.find(
    marker => marker.getTitle() === bank.place_name
  );

  if (selectedMarker) {
    // 해당 마커의 인포윈도우 열기
    const infoWindow = new window.kakao.maps.InfoWindow({
      content: `
        <div style="
          padding: 10px; 
          width: 200px; 
          max-width: 200px; 
          overflow: hidden; 
          text-overflow: ellipsis; 
          white-space: nowrap;
        ">
          <h3 style="
            font-weight: bold; 
            margin-bottom: 5px; 
            overflow: hidden; 
            text-overflow: ellipsis; 
            white-space: nowrap;
          ">${bank.place_name}</h3>
          <p style="
            margin: 3px 0; 
            overflow: hidden; 
            text-overflow: ellipsis; 
            white-space: nowrap;
          ">주소: ${bank.address_name}</p>
          <p style="
            margin: 3px 0; 
            overflow: hidden; 
            text-overflow: ellipsis; 
            white-space: nowrap;
          ">전화: ${bank.phone || '정보 없음'}</p>
          <p style="
            margin: 3px 0; 
            overflow: hidden; 
            text-overflow: ellipsis; 
            white-space: nowrap;
          ">거리: ${bank.distance}m</p>
        </div>
      `,
      removable: true
    });

    // 기존 인포윈도우 닫고 새 인포윈도우 열기
    infoWindows.value.forEach(iw => iw.close());
    infoWindow.open(map.value, selectedMarker);
    infoWindows.value = [infoWindow];
  }
};

// 근처 은행 검색 함수 (비동기)
const searchNearbyBanks = async (latitude, longitude) => {
  try {
    // Kakao Local API를 사용해 은행 검색
    const response = await axios.get('https://dapi.kakao.com/v2/local/search/category.json', {
      headers: {
        // 환경변수에서 Kakao REST API 키 가져오기
        Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}`
      },
      params: {
        category_group_code: 'BK9',  // 은행 카테고리 코드
        x: longitude,                // 경도
        y: latitude,                 // 위도
        radius: 1000,                // 1km 반경 검색
        sort: 'distance'             // 거리순 정렬
      }
    });

    // 검색 결과를 banks ref에 저장
    banks.value = response.data.documents;
    
    // 기존 마커들 모두 제거
    bankMarkers.value.forEach(marker => marker.setMap(null));
    bankMarkers.value = [];

    // 각 은행에 대해 마커와 인포윈도우 생성
    banks.value.forEach(bank => {
      // Kakao Maps LatLng 객체로 위치 변환
      const markerPosition = new window.kakao.maps.LatLng(bank.y, bank.x);
      
      // 마커 생성
      const marker = new window.kakao.maps.Marker({
        map: map.value,            // 지도 객체
        position: markerPosition,  // 위치
        title: bank.place_name     // 마커 호버 시 보이는 이름
      });

      // 마커 배열에 추가
      bankMarkers.value.push(marker);

      // 인포윈도우 생성
      const infoWindow = new window.kakao.maps.InfoWindow({
        content: `
          <div style="
            padding: 10px; 
            width: 200px; 
            max-width: 200px; 
            overflow: hidden; 
            text-overflow: ellipsis; 
            white-space: nowrap;
          ">
            <h3 style="
              font-weight: bold; 
              margin-bottom: 5px; 
              overflow: hidden; 
              text-overflow: ellipsis; 
              white-space: nowrap;
            ">${bank.place_name}</h3>
            <p style="
              margin: 3px 0; 
              overflow: hidden; 
              text-overflow: ellipsis; 
              white-space: nowrap;
            ">주소: ${bank.address_name}</p>
            <p style="
              margin: 3px 0; 
              overflow: hidden; 
              text-overflow: ellipsis; 
              white-space: nowrap;
            ">전화: ${bank.phone || '정보 없음'}</p>
            <p style="
              margin: 3px 0; 
              overflow: hidden; 
              text-overflow: ellipsis; 
              white-space: nowrap;
            ">거리: ${bank.distance}m</p>
          </div>
        `,
        removable: true // 닫기 버튼 활성화
      });

      // 마커 클릭 이벤트 리스너 추가
      window.kakao.maps.event.addListener(marker, 'click', () => {
        // 기존에 열려있는 모든 인포윈도우 닫기
        infoWindows.value.forEach(iw => iw.close());
        
        // 새 인포윈도우 열기
        infoWindow.open(map.value, marker);
        
        // 현재 인포윈도우 목록 업데이트
        infoWindows.value = [infoWindow];
      });
    });
  } catch (error) {
    // 오류 발생 시 콘솔에 로그
    console.error('은행 검색 중 오류:', error.response ? error.response.data : error);
  }
};

// 사용자 위치 가져오는 함수
const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    // 브라우저 위치 서비스 지원 확인
    if ("geolocation" in navigator) {
      // 현재 위치 요청
      navigator.geolocation.getCurrentPosition(
        position => resolve(position.coords),  // 성공 시 좌표 반환
        error => reject(error)                 // 실패 시 오류 반환
      );
    } else {
      // 위치 서비스 미지원 시 오류
      reject(new Error('Geolocation is not supported'));
    }
  });
};

// 컴포넌트 마운트 시 실행되는 로직
onMounted(async () => {
  try {
    // Kakao Maps 스크립트 동적 로드
    const script = document.createElement('script');
    // 환경변수의 Kakao JavaScript API 키 사용
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY}`;
    script.async = true;
    document.head.appendChild(script);

    // 스크립트 로드 완료 후 실행
    script.onload = async () => {
      window.kakao.maps.load(() => {
        // 지도 생성
        map.value = new window.kakao.maps.Map(mapContainer.value, {
          center: new window.kakao.maps.LatLng(mapOptions.center.lat, mapOptions.center.lng),
          level: mapOptions.level
        });

        // 사용자 위치 가져오기
        getUserLocation().then(coords => {
          // 지도 중심을 현재 위치로 이동
          const currentPosition = new window.kakao.maps.LatLng(coords.latitude, coords.longitude);
          map.value.setCenter(currentPosition);

          // 현재 위치에 특별한 마커 표시
          userLocationMarker.value = new window.kakao.maps.Marker({
            map: map.value,
            position: currentPosition,
            image: new window.kakao.maps.MarkerImage(
              'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png', 
              new window.kakao.maps.Size(24, 35)
            )
          });

          // 사용자 위치 인포윈도우 생성
          const userLocationInfoWindow = new window.kakao.maps.InfoWindow({
            content: `
              <div style="
                padding: 10px; 
                width: 200px; 
                text-align: center;
                max-width: 100px; 
                overflow: hidden; 
                text-overflow: ellipsis; 
                white-space: nowrap;
              ">
                <h3 style="
                  font-weight: bold; 
                  margin-bottom: 5px; 
                  overflow: hidden; 
                  text-overflow: ellipsis; 
                  white-space: nowrap;
                ">내 위치</h3>
              </div>
            `,
            removable: true
          });

          // 마커 클릭 이벤트 리스너 추가
          window.kakao.maps.event.addListener(userLocationMarker.value, 'click', () => {
            // 기존에 열려있는 모든 인포윈도우 닫기
            infoWindows.value.forEach(iw => iw.close());
            
            // 새 인포윈도우 열기
            userLocationInfoWindow.open(map.value, userLocationMarker.value);
            
            // 현재 인포윈도우 목록 업데이트
            infoWindows.value = [userLocationInfoWindow];
          });

          // 현재 위치 기준 근처 은행 검색
          searchNearbyBanks(coords.latitude, coords.longitude);
        }).catch(error => {
          // 위치 정보 가져오기 실패 시 콘솔에 로그
          console.error('위치 정보를 가져올 수 없습니다:', error);
        });
      });
    };
  } catch (error) {
    // 지도 로딩 중 오류 발생 시 콘솔에 로그
    console.error('지도 로딩 중 오류:', error);
  }
});
</script>

<style scoped>
.marker-image {
  width: 24px;
  height: 35px;
}
</style>