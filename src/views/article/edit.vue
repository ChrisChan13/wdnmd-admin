<template>
  <div class="container">
    <div class="card" v-loading="state.loading">
      <el-form ref="article" :model="state.article" label-position="top">
        <el-form-item label="标题" prop="title" required>
          <el-input v-model="state.article.title" />
        </el-form-item>
        <el-form-item label="封面" prop="cover">
          <el-input v-model="state.article.cover" />
        </el-form-item>
        <el-form-item label="标签" prop="labels" required>
          <el-select v-model="state.article.labels" multiple style="width: 100%;">
            <el-option
              v-for="label in state.labels"
              :key="label._id"
              :label="(label.parent ? label.parent.label + ' / ' : '') + label.label"
              :value="label._id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="内容" prop="markdown" required>
          <MarkdownEditor v-if="state.loaded" v-model="state.article.markdown" ref="markdown" />
        </el-form-item>
      </el-form>
      <div class="article-ops">
        <template v-if="state.type === 'article' && !state.id">
          <el-button
            type="primary"
            v-loading="state.submitting"
            @click="_addArticle('article')"
          >发布文章</el-button>
          <el-button v-loading="state.submitting" @click="_addArticle('draft')">保存至草稿</el-button>
          <el-button type="danger" @click="_goBack">返回上一级</el-button>
        </template>
        <template v-else-if="state.type === 'article' && state.id">
          <el-button type="primary" @click="_updateArticle('article')">保存修改</el-button>
          <el-button type="danger" @click="_goBack">放弃修改</el-button>
        </template>
        <template v-else-if="state.type === 'draft' && state.id">
          <el-button type="primary" @click="_updateArticle('draft', true)">保存并发布</el-button>
          <el-button @click="_updateArticle('draft')">保存草稿</el-button>
          <el-button type="danger" @click="_goBack">放弃修改</el-button>
        </template>
        <template v-else>
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
  addArticle,
  getArticle,
  getDraft,
  addDraft,
  updateArticle,
  updateDraft,
  updateDraftStatus,
} from '../../api';
import MarkdownEditor from '../../components/MarkdownEditor.vue';

type State = {
  article: any;
  loading: boolean;
  labels: [];
  type: string;
  id: string;
  submitting: boolean;
  loaded: boolean;
};

export default {
  name: 'ArticleEdit',
  props: ['type'],
  components: {
    MarkdownEditor,
  },
  setup(props, ctx: any) {
    const state = reactive({
      type: props.type,
      id: '',
      article: {
        title: '',
        cover: '',
        labels: [],
        markdown: '',
      },
      labels: [],
      loading: false,
      submitting: false,
      loaded: false,
    });
    const methods = {
      _getLabels: async () => {
        try {
          const labels = await getLabels();
          state.labels = labels;
        } catch (err) {
          console.log(err);
        }
      },
      _getArticle: async () => {
        try {
          state.loading = true;
          const article = await (
            state.type === 'article'
              ? getArticle(state.id)
              : getDraft(state.id)
          );
          state.article = article;
          state.loaded = true;
          state.loading = false;
        } catch (err) {
          state.loading = false;
        }
      },
      _addArticle: async (type: string) => {
        try {
          state.submitting = true;
          const { article } = state;
          const data = {
            title: article.title,
            labels: article.labels,
            markdown: article.markdown,
            richtext: ctx.refs.markdown.getContent(),
          };
          article.cover && Object.assign(data, {
            cover: article.cover,
          });
          const { article: id } = await (
            type === 'article'
              ? addArticle(data)
              : addDraft(data)
          );
          ctx.root.$router.replace(`/${type}/edit?id=${id}`);
          state.submitting = false;
        } catch (err) {
          state.submitting = false;
        }
      },
      _updateArticle: async (type: string, online: false) => {
        try {
          state.submitting = true;
          const { article, id } = state;
          const data = {
            title: article.title,
            labels: article.labels,
            markdown: article.markdown,
            richtext: ctx.refs.markdown.getContent(),
            cover: article.cover,
          };
          await (
            type === 'article'
              ? updateArticle(id, data)
              : updateDraft(id, data)
          );
          online && await updateDraftStatus(id, 'online');
          state.submitting = false;
          online && ctx.root.$router.replace(`/article/edit?id=${id}`);
        } catch (err) {
          state.submitting = false;
        }
      },
      _goBack() {
        ctx.root.$router.go(-1);
      },
    };
    onMounted(() => {
      const { id = '' } = ctx.root.$route.query;
      state.id = id;
      methods._getLabels();
      if (id && state.type) {
        methods._getArticle();
      } else {
        state.loaded = true;
      }
    });
    return {
      state,
      ...methods,
    };
  },
};
</script>

<style lang="less" scoped>
.article {
  &-ops {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
