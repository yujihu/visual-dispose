<script lang="ts" setup>
defineProps(['data'])
</script>

<template>
  <div class="banner-box">
    <el-carousel v-if="data.data && data.data.length > 0" height="176px">
      <el-carousel-item v-for="(item, index) in data.data" :key="index">
        <img :src="item.url" />
      </el-carousel-item>
    </el-carousel>
    <div class="image-null" v-else>
      <el-icon>
        <Picture />
      </el-icon>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.banner-box {
  font-size: 0;

  img {
    width: 100%;
  }

  .el-carousel__indicator--horizontal {
    padding: 12px 4px;
  }

  .el-carousel__button {
    width: 12px;
  }

  .image-null {
    background: #ffffff;
    height: 176px;
    font-size: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #c1c1c1;
  }
}
</style>
