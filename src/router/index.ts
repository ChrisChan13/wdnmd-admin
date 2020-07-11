import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

import Layout from '../layout/index.vue';
import Home from '../views/index.vue';
import LabelIndex from '../views/label/index.vue';
import LabelEdit from '../views/label/edit.vue';
import ArticleIndex from '../views/article/index.vue';
import ArticleEdit from '../views/article/edit.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    redirect: '/index',
    meta: {
      icon: 's-home',
      title: '首页',
    },
    component: Layout,
    children: [{
      path: '/index',
      name: 'HomeIndex',
      meta: {
        title: '动态',
      },
      component: Home,
    }],
  }, {
    path: '/label',
    name: 'Label',
    redirect: '/label/index',
    meta: {
      icon: 's-flag',
      title: '标签',
    },
    component: Layout,
    children: [{
      path: '/label/index',
      name: 'LabelIndex',
      meta: {
        title: '列表',
      },
      component: LabelIndex,
    }, {
      path: '/label/edit',
      name: 'LabelEdit',
      meta: {
        hidden: true,
        title: '编辑',
      },
      component: LabelEdit,
    }],
  }, {
    path: '/article',
    name: 'Article',
    redirect: '/article/index',
    meta: {
      icon: 's-promotion',
      title: '文章',
    },
    component: Layout,
    children: [{
      path: '/article/index',
      name: 'ArticleIndex',
      props: { type: 'article' },
      meta: {
        title: '列表',
      },
      component: ArticleIndex,
    }, {
      path: '/article/edit',
      name: 'ArticleEdit',
      props: { type: 'article' },
      meta: {
        hidden: true,
        title: '编辑',
      },
      component: ArticleEdit,
    }],
  }, {
    path: '/draft',
    name: 'Draft',
    redirect: '/draft/index',
    meta: {
      icon: 's-open',
      title: '草稿',
    },
    component: Layout,
    children: [{
      path: '/draft/index',
      name: 'DraftIndex',
      props: { type: 'draft' },
      meta: {
        title: '列表',
      },
      component: ArticleIndex,
    }, {
      path: '/draft/edit',
      name: 'DraftEdit',
      props: { type: 'draft' },
      meta: {
        hidden: true,
        title: '编辑',
      },
      component: ArticleEdit,
    }],
  }, {
    path: '/trash',
    name: 'Trash',
    redirect: '/trash/index',
    meta: {
      icon: 'delete-solid',
      title: '垃圾',
    },
    component: Layout,
    children: [{
      path: '/trash/index',
      name: 'TrashIndex',
      props: { type: 'trash' },
      meta: {
        title: '列表',
      },
      component: ArticleIndex,
    }],
  },
];

const router = new VueRouter({
  routes,
});

export default router;
