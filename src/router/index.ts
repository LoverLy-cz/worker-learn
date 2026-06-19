import { createRouter, createWebHistory } from "vue-router";
import Home from "@/pages/home/Home.vue";
import Note from "@/pages/note/Note.vue";
import Material from "@/pages/material/Material.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      redirect: "/note",
      children: [
        {
          path: "note",
          name: "note",
          component: Note,
        },
        {
          path: "material",
          name: "material",
          component: Material,
        },
      ],
    },
  ],
});

export default router;
