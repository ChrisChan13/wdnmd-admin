<template>
  <div class="nav-bar">
    <el-breadcrumb seperator="/">
      <el-breadcrumb-item v-for="route in breadcrumbs" :key="route.path" :to="route.path">
        <span>{{ route.meta.title }}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';

export default defineComponent({
  setup(props, { root }) {
    const breadcrumbs = computed(() => root.$route.matched.filter(
      (item) => item.name && item.meta && item.meta.title,
    ));
    return {
      breadcrumbs,
    };
  },
});
</script>

<style lang="less">
.nav {
  &-bar {
    width: 100%;
    height: 50px;
    box-sizing: border-box;
    padding-left: 20px;
    padding-right: 30px;
    border-bottom: 1px solid #DFDFDF;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
  }
}
</style>
