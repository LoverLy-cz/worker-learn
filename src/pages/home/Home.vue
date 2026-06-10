<script setup lang="ts">
  import request from "@/api/request.ts";

  const hanldeTest1 = async () => {
    const result = await request.post("/notes", {
      title: "测试1",
      content: "测试1内容",
    })
    console.log(result)
  }
</script>

<template>
  <div>
    <button @click="hanldeTest1">测试1</button>
  </div>
</template>

<style scoped>

</style>
