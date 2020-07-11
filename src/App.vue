<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="less">
html, body {
  padding: 0;
  margin: 0;
}
a {
  text-decoration: none;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.container {
  padding: 30px 0;
  position: relative;
}
.card {
  position: relative;
  width: 95%;
  box-shadow: 0 13px 19px 1px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  padding: 20px 30px;
  background: #FFF;
  margin: 0 auto 20px auto;
  border-radius: 10px;
  overflow: hidden;
  &-head {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
  }
}
.el-pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
