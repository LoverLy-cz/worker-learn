<script setup lang="ts">
  import request from "@/api/request.ts";

  const hanldeTest = async () => {
    const data = await request.get("test")
    console.log(data)
  }
</script>

<template>
  <div>
    <button @click="hanldeTest">测试</button>
  </div>
</template>

<style scoped>

</style>
