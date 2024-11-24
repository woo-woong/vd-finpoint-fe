<template>
  <!-- 지도를 포함할 전체 컨테이너. 최소 높이 500px로 설정 -->
  <div class="w-full h-full">
    <!-- 실제 지도가 렌더링될 div. ref를 사용해 Vue에서 DOM 요소에 접근 -->
    <div ref="mapContainer" class="w-full h-full shadow-md rounded-xl"></div>
  </div>
</template>

<script setup>
// Vue 및 Axios 라이브러리 import
import { ref, onMounted, reactive } from 'vue';
import axios from 'axios';

// Refs 및 반응형 변수 선언
const mapContainer = ref(null); // 지도 컨테이너 DOM 요소
const map = ref(null); // Kakao Map 인스턴스
const infoWindows = ref([]); // 열린 인포윈도우 관리
const bankMarkers = ref([]); // 은행 마커들 저장
const userLocationMarker = ref(null); // 사용자 위치 마커

// 지도 초기 옵션 설정 (반응형)
const mapOptions = reactive({
  center: { lat: 37.5665, lng: 126.978 }, // 서울 중심 좌표 (기본값)
  level: 5, // 지도 확대 레벨
});

// 부모 컴포넌트로 은행 목록 전달을 위한 이벤트 정의
const emit = defineEmits(['update:banks', 'bank-selected']);

// 근처 은행 색 함수 (비동기)
const searchNearbyBanks = async (latitude, longitude) => {
  try {
    // Kakao Local API를 사용해 은행 검색
    const response = await axios.get(
      'https://dapi.kakao.com/v2/local/search/category.json',
      {
        headers: {
          Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}`,
        },
        params: {
          category_group_code: 'BK9',
          x: longitude,
          y: latitude,
          radius: 1000,
          sort: 'distance',
        },
      }
    );

    // 검색된 은행 목록을 부모 컴포넌트로 전달
    emit('update:banks', response.data.documents);

    // 기존 마커들 모두 제거
    bankMarkers.value.forEach((marker) => marker.setMap(null));
    bankMarkers.value = [];

    // 각 은행에 대해 마커와 인포윈도우 생성
    response.data.documents.forEach((bank) => {
      const markerPosition = new window.kakao.maps.LatLng(bank.y, bank.x);

      const marker = new window.kakao.maps.Marker({
        map: map.value,
        position: markerPosition,
        title: bank.place_name,
      });

      bankMarkers.value.push(marker);

      const infoWindow = createInfoWindow(bank);

      // 마커 클릭 이벤트 리스너 추가
      window.kakao.maps.event.addListener(marker, 'click', () => {
        // 기존에 열려있는 모든 인포윈도우 닫기
        infoWindows.value.forEach((iw) => iw.close());

        // 새 인포윈도우 열기
        infoWindow.open(map.value, marker);

        // 현재 인포윈도우 목록 업데이트
        infoWindows.value = [infoWindow];

        // 선택된 은행 정보를 부모 컴포넌트로 전달
        emit('bank-selected', bank);
      });
    });
  } catch (error) {
    console.error(
      '은행 검색 중 오류:',
      error.response ? error.response.data : error
    );
  }
};

// 인포윈도우 생성 헬퍼 함수
const createInfoWindow = (bank) => {
  return new window.kakao.maps.InfoWindow({
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
    removable: true,
  });
};

// 사용자 위치 가져오는 함수
const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position.coords),
        (error) => reject(error)
      );
    } else {
      reject(new Error('Geolocation is not supported'));
    }
  });
};

// 특정 은행으로 이동하는 함수
const navigateToBank = (bank) => {
  const bankPosition = new window.kakao.maps.LatLng(bank.y, bank.x);
  map.value.setCenter(bankPosition);
  map.value.setLevel(3);

  // 마커 찾기 로직 개선
  const targetMarker = bankMarkers.value.find((marker) => {
    const pos = marker.getPosition();
    return (
      Math.abs(pos.getLat() - parseFloat(bank.y)) < 0.0000001 &&
      Math.abs(pos.getLng() - parseFloat(bank.x)) < 0.0000001
    );
  });

  if (targetMarker) {
    // 기존 인포윈도우들 모두 닫기
    infoWindows.value.forEach((iw) => iw.close());
    infoWindows.value = [];

    // 새 인포윈도우 생성 및 열기
    const infoWindow = createInfoWindow(bank);
    infoWindow.open(map.value, targetMarker);
    infoWindows.value.push(infoWindow);

    // 선택된 은행 정보 emit
    emit('bank-selected', bank);
  }
};

// 컴포넌트 마운트 시 실행되는 로직
onMounted(async () => {
  try {
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY}`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = async () => {
      window.kakao.maps.load(() => {
        map.value = new window.kakao.maps.Map(mapContainer.value, {
          center: new window.kakao.maps.LatLng(
            mapOptions.center.lat,
            mapOptions.center.lng
          ),
          level: mapOptions.level,
        });

        getUserLocation()
          .then((coords) => {
            const currentPosition = new window.kakao.maps.LatLng(
              coords.latitude,
              coords.longitude
            );
            map.value.setCenter(currentPosition);

            userLocationMarker.value = new window.kakao.maps.Marker({
              map: map.value,
              position: currentPosition,
              image: new window.kakao.maps.MarkerImage(
                'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
                new window.kakao.maps.Size(24, 35)
              ),
            });

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
              removable: true,
            });

            window.kakao.maps.event.addListener(
              userLocationMarker.value,
              'click',
              () => {
                infoWindows.value.forEach((iw) => iw.close());
                userLocationInfoWindow.open(
                  map.value,
                  userLocationMarker.value
                );
                infoWindows.value = [userLocationInfoWindow];
              }
            );

            searchNearbyBanks(coords.latitude, coords.longitude);
          })
          .catch((error) => {
            console.error('위치 정보를 가져올 수 없습니다:', error);
          });
      });
    };
  } catch (error) {
    console.error('지도 로딩 중 오류:', error);
  }
});

// 외부에서 사용할 메서드 노출
defineExpose({
  navigateToBank,
});
</script>

<style scoped>
.marker-image {
  width: 24px;
  height: 35px;
}
</style>
