<script setup>
import { ref, defineProps } from 'vue';

const props = defineProps({
  setAddress: {
    type: Function,
    required: true,
  },
});

const isShow = ref(false);

const handleComplete = (data) => {
  let fullAddress = data.address;
  let extraAddress = '';

  if (data.addressType === 'R') {
    if (data.bname !== '') {
      extraAddress += data.bname;
    }
    if (data.buildingName !== '') {
      extraAddress +=
        extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
    }
    fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
  }

  props.setAddress(fullAddress);
  isShow.value = false;
};

const loadDaumPostcode = () => {
  const script = document.createElement('script');
  script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
  script.async = true;

  script.onload = () => {
    new window.daum.Postcode({
      oncomplete: handleComplete,
      onclose: () => {
        isShow.value = false;
      },
    }).open();
  };

  document.head.appendChild(script);
};

const handleClick = () => {
  if (window.daum && window.daum.Postcode) {
    new window.daum.Postcode({
      oncomplete: handleComplete,
      onclose: () => {
        isShow.value = false;
      },
    }).open();
  } else {
    loadDaumPostcode();
  }
};
</script>

<template>
  <div>
    <button
      type="button"
      @click="handleClick"
      class="w-1/6 px-2 py-1 ml-auto text-sm text-blue-500 transition-colors duration-200 border border-blue-500 rounded-md hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
    >
      주소 검색
    </button>
  </div>
</template>
