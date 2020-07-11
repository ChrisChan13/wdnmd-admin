<template>
  <div class="container">
    <div class="card">
      <div class="card-head">
        <el-button
          type="primary"
          icon="el-icon-edit"
          @click="_toEdit()"
        >写文章</el-button>
      </div>
      <el-table :data="state.paged" stripe>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-width="100px" label-position="left" inline>
              <el-form-item label="封面" v-if="props.row.cover" class="article-expend">
                <el-image :src="props.row.cover" fit="cover" :lazy="true" class="article-cover" />
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="标题" prop="title" show-overflow-tooltip />
        <el-table-column label="标签" prop="labels">
          <template slot-scope="props">
            <el-tag
              type="info"
              size="small"
              v-for="label in props.row.labels"
              :key="label._id"
              class="article-label"
            >
              {{label.label}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column v-if="state.type === 'article'" label="状态" prop="status" width="80px">
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
        <el-table-column v-if="state.type === 'article'" label="发布" prop="postedAt" width="170px">
          <template slot-scope="props">
            <span>{{props.row.postedAt | toLocaleDate}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80px">
          <template slot-scope="props">
            <el-dropdown
              @command="_handleArticleCommand(
                $event,
                props.$index + (state.page - 1) * state.pageSize
              )"
            >
              <el-button icon="el-icon-more" size="small" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-show="props.row.status !== '-2'"
                  command="detail">编辑</el-dropdown-item>
                <el-dropdown-item
                  v-show="props.row.status === '1'"
                  command="offline">下架</el-dropdown-item>
                <el-dropdown-item
                  v-show="props.row.status === '-1'"
                  command="online">发布</el-dropdown-item>
                <el-dropdown-item
                  v-show="props.row.status === '0'"
                  command="online">上架</el-dropdown-item>
                <el-dropdown-item
                  v-show="props.row.status !== '-2'"
                  command="trash">删除</el-dropdown-item>
                <el-dropdown-item
                  v-show="props.row.status === '-2'"
                  command="draft">恢复</el-dropdown-item>
                <el-dropdown-item
                  v-show="props.row.status === '-2'"
                  command="delete">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page.sync="state.page"
        :page-size="state.pageSize"
        :total="state.articles.length"
        layout="total, prev, pager, next"
        prev-text="上一页"
        next-text="下一页"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, computed, onMounted } from '@vue/composition-api';

import {
  getArticles,
  getDrafts,
  getTrashes,
  updateArticleStatus,
  updateDraftStatus,
  updateTrashStatus,
  deleteTrash,
} from '../../api';
import mixins from '../mixins';

type State = {
  status: [];
  loading: boolean;
  page: number;
  pageSize: number;
  articles: [];
  paged: [];
};

export default {
  name: 'ArticleIndex',
  props: ['type'],
  mixins: [mixins],
  setup(props, { root }) {
    const state = reactive({
      type: props.type,
      status: [{
        text: '已下架',
        type: 'danger',
      }, {
        text: '已上架',
        type: 'success',
      }],
      loading: true,
      page: 1,
      pageSize: 10,
      articles: [],
      paged: computed(() => state.articles.slice(
        (state.page - 1) * state.pageSize, state.page * state.pageSize,
      )),
    });
    const methods = {
      _getArticles: async () => {
        try {
          state.loading = true;
          const articles = await (
            state.type === 'article'
              ? getArticles()
              : state.type === 'draft'
                ? getDrafts()
                : getTrashes()
          );
          state.articles = articles;
          state.loading = false;
        } catch (err) {
          state.loading = false;
        }
      },
      _handleArticleCommand: async (command: string, index: number) => {
        try {
          const { _id } = state.articles[index];
          let status = '';
          switch (command) {
            case 'detail':
              methods._toEdit(_id);
              break;
            case 'delete':
              await deleteTrash(_id);
              state.articles.splice(index, 1);
              break;
            case 'offline':
              command === 'offline' && (status = '0');
            case 'draft':
            case 'online':
              command === 'online' && state.type === 'article' && (status = '1');
            case 'trash':
              console.log(status, state.type);
              await (
                state.type === 'article'
                  ? updateArticleStatus(_id, command)
                  : state.type === 'draft'
                    ? updateDraftStatus(_id, command)
                    : updateTrashStatus(_id, command)
              );
              status
                ? (state.articles[index].status = status)
                : state.articles.splice(index, 1);
              break;
            default:
          }
        } catch (err) {
          console.error(err);
        }
      },
      _toEdit: (id) => {
        root.$router.push(`/${id ? state.type : 'article'}/edit${id ? `?id=${id}` : ''}`);
      },
    };
    onMounted(() => {
      methods._getArticles();
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
  &-expend {
    width: 50%;
    margin: 0;
  }
  &-cover {
    width: 200px;
    height: 100px;
    display: block;
  }
  &-label {
    margin-right: 6px;
  }
}
</style>
