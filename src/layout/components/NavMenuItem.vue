<template>
  <div v-if="!route.meta.hidden && route.children" class="nav-item">
    <router-link v-if="onlyChild" :key="onlyChild.path" :to="onlyChild.path">
      <el-menu-item :index="onlyChild.path">
        <NavMenuLabel :icon="route.meta.icon" :title="route.meta.title" />
      </el-menu-item>
    </router-link>
    <el-submenu v-else :index="route.path">
      <template slot="title">
        <NavMenuLabel :icon="route.meta.icon" :title="route.meta.title" />
      </template>
      <template v-for="child in route.children">
        <NavMenuItem v-if="child.children" :key="child.path" :route="child" />
        <router-link v-else :key="child.path" :to="child.path">
          <el-menu-item :index="child.path">
            <NavMenuLabel :icon="child.meta.icon" :title="child.meta.title" />
          </el-menu-item>
        </router-link>
      </template>
    </el-submenu>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

import NavMenuLabel from './NavMenuLabel.vue';

export default defineComponent({
  name: 'NavMenuItem',
  components: {
    NavMenuLabel,
  },
  props: {
    route: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { route } = props;
    let onlyChild = null;
    const showingChildren = route.children.filter((item: any) => !item.meta.hidden);
    if (showingChildren.length === 1) onlyChild = { ...showingChildren[0] };
    return {
      onlyChild,
    };
  },
});
</script>

<style lang="less" scoped>
.nav {
  &-item {
    width: 100%;
  }
}
</style>
