<template>
  <div>
    <i v-if="icon" :class="[ iconClass ]" />
    <span>{{ title }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'NavMenuLabel',
  props: {
    icon: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    let iconClass = '';
    if (props.icon) iconClass = `el-icon-${props.icon}`;
    return {
      iconClass,
    };
  },
});
</script>
