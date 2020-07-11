<template>
  <div class="container">
    <div class="card" v-loading="state.activeness.length === 0 && state.loading">
      <div class="hint" v-if="state.activeness.length === 0">
        <span>暂无动态~</span>
      </div>
      <template v-else>
        <el-timeline>
          <el-timeline-item
            v-for="item in state.activeness"
            :key="item.date"
            :timestamp="item.date | getTimestamp"
            placement="top"
          >
            <el-card
              v-for="item in item.operations"
              :key="item.date"
            >
              <h4>{{ item.type | getPrefix }}『 {{ item.title }} 』</h4>
              <p>提交于 {{ item.date | toLocaleDate }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
        <div class="more">
          <el-button
            :disabled="!state.hasMore"
            :loading="state.activeness.length > 0 && state.loading"
            @click="_getActiveness"
            icon="el-icon-caret-bottom"
          >
            <span>查看更多动态</span>
          </el-button>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, onMounted } from '@vue/composition-api';

import mixins from './mixins';
import { getActiveness } from '../api/index';

type State = {
  loading: boolean;
  activeness: any[];
  hasMore: boolean;
};

export default {
  name: 'Home',
  mixins: [mixins],
  filters: {
    getPrefix(value: string) {
      const prefixes = new Map([
        ['-3', '移入垃圾箱'],
        ['-2', '下架文章'],
        ['-1', '保存草稿'],
        ['0', '发布文章'],
        ['1', '更新文章'],
        ['2', '上架文章'],
        ['3', '恢复文章'],
      ]);
      return prefixes.get(value);
    },
    getTimestamp(value: string) {
      const weeks = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      const date = new Date(value);
      return `${value} ${weeks[date.getDay()]}`;
    },
  },
  setup() {
    const state: State = reactive({
      loading: true,
      activeness: [],
      hasMore: true,
    });
    let page = 1;
    const limit = 10;
    const methods = {
      _getActiveness: async () => {
        try {
          state.loading = true;
          const activeness = await getActiveness({ page, limit });
          page += 1;
          let counts = 0;
          activeness.map((item) => {
            counts += item.operations.length;
            const index = state.activeness.findIndex((temp: any) => temp.date === item.date);
            if (index > -1) {
              (state.activeness[index] as any).operations.push(...item.operations);
            } else {
              state.activeness.push(item);
            }
            return item;
          });
          state.hasMore = counts === limit;
          state.loading = false;
        } catch (err) {
          state.loading = false;
        }
      },
    };
    onMounted(() => {
      methods._getActiveness();
    });
    return {
      state,
      ...methods,
    };
  },
};
</script>

<style lang="less">
.hint {
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #808080;
}
.el-timeline {
  text-align: left;
  &-item__timestamp.is-top {
    margin-bottom: 1em;
  }
}
.el-card {
  margin-bottom: 1em;
  &__body {
    padding: 0 20px;
  }
}
.more {
  display: flex;
  justify-content: center;
}
</style>
