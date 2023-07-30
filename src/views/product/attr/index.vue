<template>
  <div>
    <Category></Category>
    <el-card style="margin-top: 20px">
      <el-button type="primary" icon="plus">添加平台属性</el-button>
      <el-table border style="margin-top: 20px">
        <el-table-column
          label="序号"
          type="index"
          width="80"
          align="center"
        ></el-table-column>
        <el-table-column label="属性名称" width="120"></el-table-column>
        <el-table-column label="属性值名称"></el-table-column>
        <el-table-column label="操作" width="120"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
