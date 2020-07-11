<template>
  <div class="container">
    <div class="card" v-loading="state.loading">
      <el-form ref="label" :model="state.label" label-position="left">
        <el-form-item label="标签" prop="label" required>
          <el-input v-model="state.label.label" />
        </el-form-item>
        <el-form-item label="假名" prop="alias" required>
          <el-input v-model="state.label.alias" />
        </el-form-item>
        <el-form-item label="父级" prop="parent">
          <el-select v-model="state.label.parent" clearable style="width: 100%;">
            <el-option
              v-for="label in state.labels"
              :key="label._id"
              :disabled="label.status === '0'"
              :label="label.label"
              :value="label._id" />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="label-ops">
        <template v-if="state.id">
          <el-button
            type="primary"
            :loading="state.submitting"
            @click="_updateLabel"
          >保存修改</el-button>
          <el-button type="danger" @click="_goBack">放弃修改</el-button>
        </template>
        <template v-else>
          <el-button type="primary" @click="_addLabel">添加标签</el-button>
          <el-button type="danger" @click="_goBack">返回上一级</el-button>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, onMounted } from '@vue/composition-api';

import {
  getLabels,
  getLabel,
  updateLabel,
  addLabel,
} from '../../api';

type State = {
  id: string;
  loading: boolean;
  labels: [];
  label: any;
  submitting: boolean;
};

export default {
  name: 'LabelEdit',
  setup(props, { root }) {
    const state = reactive({
      id: '',
      loading: false,
      labels: [],
      label: {
        _id: '',
        label: '',
        alias: '',
        parent: '',
      },
      submitting: false,
    });
    const methods = {
      _getLabels: async () => {
        try {
          const labels = await getLabels();
          state.labels = labels.filter((item: any) => !item.parent);
        } catch (err) {
          console.log(err);
        }
      },
      _getLabel: async () => {
        try {
          state.loading = true;
          const label = await getLabel(state.id);
          state.label = label;
          state.loading = false;
        } catch (err) {
          state.loading = false;
          state.id = '';
        }
      },
      _updateLabel: async () => {
        try {
          state.submitting = true;
          const {
            _id,
            label,
            alias,
            parent,
          } = state.label;
          const data = {
            label,
            alias,
          };
          parent && Object.assign(data, { parent });
          await updateLabel(_id, data);
          state.submitting = false;
        } catch (err) {
          state.submitting = false;
        }
      },
      _addLabel: async () => {
        try {
          state.submitting = true;
          const { label } = state;
          const data = {
            label: label.label,
            alias: label.alias,
          };
          console.log(label.parent, !!label.parent);
          label.parent && Object.assign(data, {
            parent: label.parent,
          });
          const { label: id } = await addLabel(data);
          state.submitting = false;
          root.$router.replace(`/label/edit?id=${id}`);
        } catch (err) {
          state.submitting = false;
        }
      },
      _goBack() {
        root.$router.go(-1);
      },
    };
    onMounted(() => {
      const { id = '' } = root.$route.query;
      state.id = id.toString();
      methods._getLabels();
      if (id) methods._getLabel();
    });
    return {
      state,
      ...methods,
    };
  },
};
</script>

<style lang="less" scoped>
.label {
  &-ops {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
