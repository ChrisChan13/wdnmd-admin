<template>
  <div class="container">
    <div class="card" v-loading="state.loading">
      <div class="card-head">
        <el-button type="primary" icon="el-icon-edit" @click="_toEdit()">添加标签</el-button>
      </div>
      <el-table :data="state.paged" stripe>
        <el-table-column label="标签" prop="label" />
        <el-table-column label="假名" prop="alias" />
        <el-table-column label="父级" prop="parent">
          <template slot-scope="props">
            <span>{{ props.row.parent ? props.row.parent.label : '- -' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status">
          <template slot-scope="props">
            <el-tag size="small" :type="state.status[props.row.status].type">
              {{state.status[props.row.status].text}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="更新" prop="updatedAt" width="170px">
          <template slot-scope="props">
            <span>{{props.row.updatedAt | toLocaleDate}}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建" prop="createdAt" width="170px">
          <template slot-scope="props">
            <span>{{props.row.createdAt | toLocaleDate}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="props">
            <el-dropdown
              @command="_handleLabelCommand(
                $event,
                props.$index + (state.page - 1) * state.pageSize
              )">
              <el-button icon="el-icon-more" size="small" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="detail">编辑</el-dropdown-item>
                <el-dropdown-item
                  v-show="props.row.status === '1'"
                  command="offline">下架</el-dropdown-item>
                <el-dropdown-item
                  v-show="props.row.status === '0'"
                  command="online">上架</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page.sync="state.page"
        :page-size="state.pageSize"
        :total="state.labels.length"
        layout="total, prev, pager, next"
        prev-text="上一页"
        next-text="下一页"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, onMounted, computed } from '@vue/composition-api';

import mixins from '../mixins';
import { getLabels, updateLabelStatus } from '../../api/index';

type State = {
  page: number;
  pageSize: number;
  loading: boolean;
  status: Array<any>;
  labels: [];
  paged: Array<any>;
};

export default {
  name: 'LabelIndex',
  mixins: [mixins],
  setup(props, { root }) {
    const state: State = reactive({
      page: 1,
      pageSize: 10,
      loading: true,
      status: [{
        text: '已下架',
        type: 'danger',
      }, {
        text: '已上架',
        type: 'success',
      }],
      labels: [],
      paged: computed(() => state.labels.slice(
        (state.page - 1) * state.pageSize, state.page * state.pageSize,
      )),
    });
    const methods = {
      _getLabels: async () => {
        try {
          state.loading = true;
          const labels = await getLabels();
          state.labels = labels;
          state.loading = false;
        } catch (err) {
          state.loading = false;
        }
      },
      _handleLabelCommand: async (command: string, index: number) => {
        try {
          const { _id } = state.labels[index];
          switch (command) {
            case 'detail':
              methods._toEdit(_id);
              break;
            case 'offline':
            case 'online':
              await updateLabelStatus(_id, command);
              state.loading = true;
              methods._getLabels();
              break;
            default:
          }
        } catch (err) {
          console.log(err);
        }
      },
      _toEdit: (id: string) => {
        root.$router.push(`/label/edit${id ? `?id=${id}` : ''}`);
      },
    };
    onMounted(() => {
      methods._getLabels();
    });
    return {
      state,
      ...methods,
    };
  },
};
</script>
