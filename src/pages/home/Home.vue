<script setup lang="ts">
  import request from "@/api/request.ts";
  import { reactive, ref, onMounted, onBeforeMount } from "vue";

  interface CreateNoteInput {
    title: string;
    content: string;
  }

  interface Note {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
  }

  const createNoteInput = reactive<CreateNoteInput>({
    title: "",
    content: "",
  });

  const notes = ref<Note[]>([]);

  const handleAdd = async () => {
    const result = await request.post("/notes", createNoteInput)

    const data: Note = result.data;
    createNoteInput.title = "";
    createNoteInput.content = "";

    notes.value.push(data);
  }

  const handleDelete = async (event: Event, note: Note) => {
    await request.delete(`/notes/${ note.id }`);
    notes.value = notes.value.filter(item => item.id !== note.id);
  }

  const getNoteList = async () => {
    let result = await request.get("/notes");
    notes.value = result.data;
  }

  onBeforeMount(() => {
    getNoteList();
  })

</script>

<template>
  <div>
    <div>
      <h2>添加数据</h2>
      <label>标题<input placeholder="请输入标题" v-model.trim="createNoteInput.title" type="text"></label>
      <label>内容<input placeholder="请输入内容" v-model.trim="createNoteInput.content" type="text"></label>
      <button @click="handleAdd">添加</button>
    </div>

    <div>
      <h2>注释列表</h2>
      <ul class="note-list" v-if="notes.length > 0">
        <li class="note-list-item" v-for="note in notes" :key="note.id">
          <h3>{{ note.title }}</h3>
          <p>{{ note.content }}</p>
          <button @click="handleDelete($event, note)">删除</button>
        </li>
      </ul>
      <p v-else>暂无数据</p>
    </div>
  </div>
</template>

<style scoped>
  .note-list-item {
    display: flex;
    align-items: center;
  }
</style>
