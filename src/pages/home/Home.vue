<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from "vue-router";

const route = useRoute();

const menus = [
  {
    name: "note",
    title: "Note",
    description: "管理备注内容",
    to: "/note",
  },
  {
    name: "material",
    title: "Material",
    description: "管理素材资源",
    to: "/material",
  },
];
</script>

<template>
  <div class="dashboard-layout">
    <aside class="dashboard-sidebar">
      <div class="dashboard-brand">
        <p class="dashboard-brand__eyebrow">Worker Learn</p>
        <h1 class="dashboard-brand__title">后台管理系统</h1>
        <p class="dashboard-brand__summary">
          使用 Vue + Hono + Drizzle 搭出来的轻量管理后台。
        </p>
      </div>

      <nav class="dashboard-menu">
        <RouterLink
          v-for="menu in menus"
          :key="menu.name"
          :to="menu.to"
          class="dashboard-menu__item"
          :class="{ 'dashboard-menu__item--active': route.path === menu.to }"
        >
          <strong>{{ menu.title }}</strong>
          <span>{{ menu.description }}</span>
        </RouterLink>
      </nav>
    </aside>

    <section class="dashboard-content">
      <header class="dashboard-topbar">
        <div>
          <p class="dashboard-topbar__eyebrow">Current Module</p>
          <h2 class="dashboard-topbar__title">
            {{ route.name === "material" ? "Material 管理" : "Note 管理" }}
          </h2>
        </div>
      </header>

      <div class="dashboard-content__body">
        <RouterView />
      </div>
    </section>
  </div>
</template>
