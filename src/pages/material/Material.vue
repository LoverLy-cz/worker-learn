<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import {
  createMaterial,
  deleteMaterial,
  getMaterialList,
  type Material,
  type MaterialInput,
  updateMaterial,
} from "@/api/material";

const materials = ref<Material[]>([]);
const loading = ref(false);
const saving = ref(false);
const editingId = ref<number | null>(null);
const formMessage = ref("");

const form = reactive<MaterialInput>({
  title: "",
  cover: "",
  desc: "",
  downloads: 0,
});

const totalMaterials = computed(() => materials.value.length);
const totalDownloads = computed(() =>
  materials.value.reduce((sum, item) => sum + (item.downloads ?? 0), 0),
);

function resetForm() {
  editingId.value = null;
  form.title = "";
  form.cover = "";
  form.desc = "";
  form.downloads = 0;
}

async function loadMaterials() {
  loading.value = true;
  try {
    materials.value = await getMaterialList();
  } finally {
    loading.value = false;
  }
}

function startEdit(item: Material) {
  editingId.value = item.id;
  form.title = item.title;
  form.cover = item.cover;
  form.desc = item.desc ?? "";
  form.downloads = item.downloads ?? 0;
  formMessage.value = `正在编辑 ${item.title}`;
}

async function submitForm() {
  if (!form.title.trim() || !form.cover.trim()) {
    formMessage.value = "标题和封面地址不能为空";
    return;
  }

  saving.value = true;
  try {
    if (editingId.value === null) {
      const created = await createMaterial({
        title: form.title,
        cover: form.cover,
        desc: form.desc || undefined,
        downloads: form.downloads ?? 0,
      });
      materials.value = [created, ...materials.value];
      formMessage.value = "新增成功";
    } else {
      const updated = await updateMaterial(editingId.value, {
        title: form.title,
        cover: form.cover,
        desc: form.desc || undefined,
        downloads: form.downloads ?? 0,
      });
      materials.value = materials.value.map((item) =>
        item.id === updated.id ? updated : item,
      );
      formMessage.value = "更新成功";
    }

    resetForm();
  } finally {
    saving.value = false;
  }
}

async function removeItem(id: number) {
  await deleteMaterial(id);
  materials.value = materials.value.filter((item) => item.id !== id);
  if (editingId.value === id) {
    resetForm();
  }
}

onMounted(() => {
  loadMaterials();
});
</script>

<template>
  <section class="module-page">
    <div class="module-hero">
      <div>
        <p class="module-kicker">Material</p>
        <h2 class="module-title">素材管理中心</h2>
        <p class="module-summary">
          这里连接 `/api/materials`，支持素材的新增、编辑、删除和列表刷新。
        </p>
      </div>

      <div class="module-stats">
        <article class="stat-card">
          <span class="stat-label">素材数量</span>
          <strong class="stat-value">{{ totalMaterials }}</strong>
        </article>
        <article class="stat-card">
          <span class="stat-label">下载总数</span>
          <strong class="stat-value">{{ totalDownloads }}</strong>
        </article>
      </div>
    </div>

    <div class="module-grid">
      <section class="panel panel-form">
        <div class="panel-head">
          <div>
            <p class="panel-subtitle">编辑区</p>
            <h3 class="panel-title">
              {{ editingId === null ? "新增素材" : "编辑素材" }}
            </h3>
          </div>
          <button class="ghost-button" type="button" @click="resetForm">重置</button>
        </div>

        <div class="form-grid">
          <label class="field">
            <span>标题</span>
            <input v-model.trim="form.title" type="text" placeholder="输入素材标题" />
          </label>

          <label class="field">
            <span>封面地址</span>
            <input v-model.trim="form.cover" type="text" placeholder="输入图片 URL" />
          </label>

          <label class="field field-full">
            <span>描述</span>
            <textarea
              v-model.trim="form.desc"
              rows="4"
              placeholder="写一点素材说明"
            />
          </label>

          <label class="field">
            <span>下载次数</span>
            <input v-model.number="form.downloads" type="number" min="0" step="1" />
          </label>
        </div>

        <p class="feedback" :class="{ error: formMessage.includes('不能为空') }">
          {{ formMessage }}
        </p>

        <div class="action-row">
          <button class="primary-button" type="button" :disabled="saving" @click="submitForm">
            {{ saving ? "保存中..." : editingId === null ? "新增素材" : "保存修改" }}
          </button>
        </div>
      </section>

      <section class="panel panel-list">
        <div class="panel-head">
          <div>
            <p class="panel-subtitle">素材列表</p>
            <h3 class="panel-title">接口返回结果</h3>
          </div>
          <button class="ghost-button" type="button" :disabled="loading" @click="loadMaterials">
            {{ loading ? "刷新中..." : "刷新列表" }}
          </button>
        </div>

        <div v-if="materials.length > 0" class="cards">
          <article v-for="item in materials" :key="item.id" class="content-card">
            <img class="content-card__cover" :src="item.cover" :alt="item.title" />
            <div class="content-card__body">
              <div>
                <h4 class="content-card__title">{{ item.title }}</h4>
                <p class="content-card__desc">{{ item.desc || "暂无描述" }}</p>
              </div>

              <div class="content-card__meta">
                <span>下载 {{ item.downloads ?? 0 }}</span>
                <span>#{{ item.id }}</span>
              </div>

              <div class="content-card__actions">
                <button class="secondary-button" type="button" @click="startEdit(item)">
                  编辑
                </button>
                <button class="danger-button" type="button" @click="removeItem(item.id)">
                  删除
                </button>
              </div>
            </div>
          </article>
        </div>

        <div v-else class="empty-state">
          <p>暂无素材数据，先在左侧新增一条试试。</p>
        </div>
      </section>
    </div>
  </section>
</template>
