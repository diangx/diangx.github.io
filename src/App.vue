<template>
  <div :class="pageClass">
    <template v-if="isCodePage">
      <router-view /> <!-- /code 경로에서 깨끗하게 렌더링 -->
    </template>
    <template v-else>
      <v-container :class="containerClass">
        <router-view />
      </v-container>
      <LanguageSelector />
    </template>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import LanguageSelector from "./components/LanguageSelector.vue";

export default {
  components: {
    LanguageSelector,
  },
  setup() {
    const route = useRoute();

    // 현재 경로가 '/code'인지 확인
    const isCodePage = computed(() => route.path === '/code' || route.path === '/mcs');

    // /code 경로에서는 'clean-page', 그 외는 'styled-page'
    const pageClass = computed(() => (isCodePage.value ? 'clean-page' : 'styled-page'));

    return {
      isCodePage,
      pageClass,
    };
  },
  data() {
    return {
      isMobile: false,
    };
  },
  computed: {
    containerClass() {
      return this.isMobile ? 'px-1' : 'px-16';
    },
  },
  mounted() {
    this.checkIfMobile();
    window.addEventListener('resize', this.checkIfMobile);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkIfMobile);
  },
  methods: {
    checkIfMobile() {
      this.isMobile = window.innerWidth <= 768;
    },
  },
};
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

.styled-page {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: #F5F5F5;
  min-height: 100vh;
  background-image: url('@/assets/background-high.webp');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  background-attachment: fixed;
}

/* /code 경로에서만 적용되는 깨끗한 스타일 */
.clean-page {
  background: none; /* 배경 제거 */
  color: inherit; /* 글자색 초기화 */
  font-family: inherit; /* 기본 폰트로 초기화 */
  min-height: auto; /* 높이 제한 제거 */
  padding: 0; /* 여백 제거 */
}
</style>
