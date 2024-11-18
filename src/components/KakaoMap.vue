<script setup>
import { ref } from 'vue';
import { KakaoMap, KakaoMapMarker } from 'vue3-kakao-maps';

const coordinate = ref({
  lat: 37.566826,
  lng: 126.9786567,
});

// 지도 클릭 시 마커 이동
const handleMapClick = (e) => {
  coordinate.value = {
    lat: e.latLng.getLat(),
    lng: e.latLng.getLng(),
  };
};

// 마커를 드래그했을 때 좌표 업데이트
const handleMarkerDragEnd = (marker) => {
  const position = marker.getPosition();
  coordinate.value = {
    lat: position.getLat(),
    lng: position.getLng(),
  };
};
</script>

<style scoped>
/* 부모 컨테이너가 고정된 크기를 가지고 있어야 지도가 잘 표시됩니다 */
:deep(.kakao-map) {
  width: 100%;
  height: 100%;
}
</style>
    
<template>
  <div class="w-full h-full">
    <KakaoMap
      :lat="coordinate.lat"
      :lng="coordinate.lng"
      :level="3"
      :draggable="true"
      style="width: 100%; height: 100%"
      @click="handleMapClick"
    >
      <KakaoMapMarker
        :lat="coordinate.lat"
        :lng="coordinate.lng"
        :draggable="true"
        @drag-end="handleMarkerDragEnd"
      >
        <!-- Optional: 마커 클릭시 보여줄 인포윈도우 -->
        <template v-slot:infoWindow>
          <div class="p-2">
            위도: {{ coordinate.lat.toFixed(6) }}<br />
            경도: {{ coordinate.lng.toFixed(6) }}
          </div>
        </template>
      </KakaoMapMarker>
    </KakaoMap>
  </div>
</template>

