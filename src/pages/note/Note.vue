<script setup lang="ts">
import request from "@/api/request";
import { computed, onMounted, reactive, ref } from "vue";

interface Note {
  id?: number;
  title: string;
  content: string;
}

const noteInput = reactive<Note>({
  title: "",
  content: "",
});

const notes = ref<Note[]>([]);
const isEditing = ref(false);
const statusMessage = ref("");

const operationText = computed(() => (isEditing.value ? "编辑" : "新增"));
const totalNotes = computed(() => notes.value.length);

async function loadNotes() {
  const result = await request.get("/notes");
  notes.value = result.data.data;
}

async function doAdd() {
  const result = await request.post("/notes", noteInput);
  const data: Note = result.data.data;

  noteInput.title = "";
  noteInput.content = "";
  notes.value.unshift(data);
  statusMessage.value = "新增成功";
}

async function doEdit() {
  const result = await request.patch(`/notes/${noteInput.id}`, {
    title: noteInput.title,
    content: noteInput.content,
  });

  const updated: Note = result.data.data;
  const target = notes.value.find((item) => item.id === noteInput.id);
  if (target) {
    target.title = updated.title;
    target.content = updated.content;
  }

  noteInput.id = undefined;
  noteInput.title = "";
  noteInput.content = "";
  isEditing.value = false;
  statusMessage.value = "更新成功";
}

async function handleDelete(note: Note) {
  if (!note.id) {
    return;
  }

  await request.delete(`/notes/${note.id}`);
  notes.value = notes.value.filter((item) => item.id !== note.id);
  statusMessage.value = "删除成功";
}

function handleEdit(note: Note) {
  isEditing.value = true;
  noteInput.id = note.id;
  noteInput.title = note.title;
  noteInput.content = note.content;
  statusMessage.value = `正在编辑：${note.title}`;
}

function resetForm() {
  noteInput.id = undefined;
  noteInput.title = "";
  noteInput.content = "";
  isEditing.value = false;
}

async function handleOperation() {
  if (isEditing.value) {
    await doEdit();
    return;
  }

  await doAdd();
}

onMounted(() => {
  loadNotes();
});
</script>

<template>
  <section class="module-page">
    <div class="module-hero">
      <div>
        <p class="module-kicker">Note</p>
        <h2 class="module-title">备注管理中心</h2>
        <p class="module-summary">
          这里连接 `/api/notes`，支持备注的新增、编辑、删除和列表刷新。
        </p>
      </div>

      <div class="module-stats">
        <article class="stat-card">
          <span class="stat-label">备注数量</span>
          <strong class="stat-value">{{ totalNotes }}</strong>
        </article>
        <article class="stat-card">
          <span class="stat-label">当前模式</span>
          <strong class="stat-value">{{ operationText }}</strong>
        </article>
      </div>
    </div>

    <div class="module-grid">
      <section class="panel panel-form">
        <div class="panel-head">
          <div>
            <p class="panel-subtitle">编辑区</p>
            <h3 class="panel-title">{{ operationText }}备注</h3>
          </div>
          <button class="ghost-button" type="button" @click="resetForm">重置</button>
        </div>

        <div class="form-grid">
          <label class="field field-full">
            <span>标题</span>
            <input v-model.trim="noteInput.title" type="text" placeholder="请输入标题" />
          </label>

          <label class="field field-full">
            <span>内容</span>
            <textarea
              v-model.trim="noteInput.content"
              rows="5"
              placeholder="请输入备注内容"
            />
          </label>
        </div>

        <p class="feedback">{{ statusMessage }}</p>

        <div class="action-row">
          <button class="primary-button" type="button" @click="handleOperation">
            {{ operationText }}
          </button>
        </div>
      </section>

      <section class="panel panel-list">
        <div class="panel-head">
          <div>
            <p class="panel-subtitle">备注列表</p>
            <h3 class="panel-title">接口返回结果</h3>
          </div>
          <button class="ghost-button" type="button" @click="loadNotes">刷新列表</button>
        </div>

        <div v-if="notes.length > 0" class="cards">
          <article v-for="note in notes" :key="note.id" class="content-card">
            <div class="content-card__body">
              <div>
                <h4 class="content-card__title">{{ note.title }}</h4>
                <p class="content-card__desc">{{ note.content }}</p>
              </div>

              <div class="content-card__meta">
                <span>#{{ note.id }}</span>
                <span>可编辑</span>
              </div>

              <div class="content-card__actions">
                <button class="secondary-button" type="button" @click="handleEdit(note)">
                  编辑
                </button>
                <button class="danger-button" type="button" @click="handleDelete(note)">
                  删除
                </button>
              </div>
            </div>
          </article>
        </div>

        <div v-else class="empty-state">
          <p>暂无备注数据，先新增一条试试。</p>
        </div>
      </section>
    </div>
  </section>
</template>
