<template>
  <div class="layout">
    <NavMenu />
    <div class="layout-main">
      <NavBar />
      <el-scrollbar class="layout-content">
        <router-view :key="key" />
      </el-scrollbar>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';

import NavMenu from './components/NavMenu.vue';
import NavBar from './components/NavBar.vue';

export default defineComponent({
  name: 'Layout',
  components: {
    NavMenu,
    NavBar,
  },
  setup(props, { root }) {
    const key = computed(() => root.$route.fullPath);
    return {
      key,
    };
  },
});
</script>

<style lang="less" scoped>
.layout {
  min-width: 1024px;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  &-main {
    width: calc(100% - 200px);
  }
  &-content {
    position: relative;
    width: 100%;
    height: calc(100% - 50px);
    background: #f6f6f6;
  }
}
</style>
