<template>
  <div class="nav-menu">
    <div class="nav-wrap">
      <el-menu
        :show-timeout="200"
        :default-active="route.path"
        background-color="#304156"
        text-color="#BFCBD9"
        active-text-color="#409EFF"
        mode="vertical"
        class="nav-list"
      >
        <NavMenuItem v-for="route in routes" :key="route.path" :route="route" />
      </el-menu>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

import NavMenuItem from './NavMenuItem.vue';

export default defineComponent({
  name: 'NavMenu',
  components: {
    NavMenuItem,
  },
  setup(props, { root }) {
    const { $route } = root;
    const { routes } = (root.$router as any).options;
    return {
      route: $route,
      routes,
    };
  },
});
</script>

<style lang="less" scoped>
.nav {
  &-menu {
    width: 200px;
    height: 100%;
    overflow: hidden;
    background: #304156;
  }
  &-wrap {
    width: 220px;
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    box-sizing: border-box;
  }
  &-list {
    width: 200px;
  }
}
</style>
