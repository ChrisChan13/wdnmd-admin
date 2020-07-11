import request from '../utils/request';

export const getActiveness = (data: {}) => request<any>({
  url: '/activeness',
  method: 'get',
  data,
});

export const getLabels = () => request<any>({
  url: '/labels',
});

export const updateLabelStatus = (id: string, command: string) => request({
  url: `/labels/${id}/${command}`,
  method: 'post',
});

export const getLabel = (id: string) => request<any>({
  url: `/labels/${id}`,
  method: 'get',
});

export const updateLabel = (id: string, data: {}) => request({
  url: `/labels/${id}`,
  method: 'post',
  data,
});

export const addLabel = (data: {}) => request<any>({
  url: '/labels',
  method: 'put',
  data,
});

export const getArticles = () => request<any>({
  url: '/articles',
  method: 'get',
});

export const updateArticleStatus = (id: string, command: string) => request({
  url: `/articles/${id}/${command}`,
  method: 'post',
});

export const addArticle = (data) => request<any>({
  url: '/articles',
  method: 'put',
  data,
});

export const getArticle = (id: string) => request({
  url: `/articles/${id}`,
  method: 'get',
});

export const getDrafts = () => request<any>({
  url: '/drafts',
  method: 'get',
});

export const addDraft = (data: {}) => request<any>({
  url: '/drafts',
  method: 'put',
  data,
});

export const updateDraftStatus = (id: string, command: string) => request({
  url: `/drafts/${id}/${command}`,
  method: 'post',
});

export const getDraft = (id: string) => request({
  url: `/drafts/${id}`,
  method: 'get',
});

export const getTrashes = () => request<any>({
  url: '/trashes',
  method: 'get',
});

export const updateTrashStatus = (id: string, command: string) => request({
  url: `/trashes/${id}/${command}`,
  method: 'post',
});

export const deleteTrash = (id: string) => request({
  url: `/trashes/${id}`,
  method: 'delete',
});

export const updateArticle = (id: string, data: {}) => request({
  url: `/articles/${id}`,
  method: 'post',
  data,
});

export const updateDraft = (id: string, data: {}) => request({
  url: `/drafts/${id}`,
  method: 'post',
  data,
});
