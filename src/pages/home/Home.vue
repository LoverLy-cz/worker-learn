<script setup lang="ts">
  import request from "@/api/request.ts";
  import { reactive, ref, onMounted, onBeforeMount, computed } from "vue";

  interface Note {
    id?: number;
    title: string;
    content: string;
    createdAt?: Date;
    updatedAt?: Date;
  }

  const noteInput = reactive<Note>({
    title: "",
    content: "",
  });


  const notes = ref<Note[]>([]);

  const isEditing = ref(false);

  const doAdd = async () => {
    const result = await request.post("/notes", noteInput)

    const data: Note = result.data;
    noteInput.title = "";
    noteInput.content = "";

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

  const handleEdit = (event: Event, note: Note) => {
    isEditing.value = true;

    noteInput.id = note.id;
    noteInput.title = note.title;
    noteInput.content = note.content;
  }

  onBeforeMount(() => {
    getNoteList();
  })

  let operationText = computed(() => {
    return isEditing.value ? "编辑" : '新增';
  });

  const doEdit = async () => {
    const result = await request.patch(`/notes/${ noteInput.id }`, {
      title: noteInput.title,
      content: noteInput.content
    });

    let find = notes.value.find(item => item.id === noteInput.id);
    if (find) {
      find.title = noteInput.title;
      find.content = noteInput.content;
    }


    noteInput.id = undefined;
    noteInput.title = ""
    noteInput.content = "";

    isEditing.value = false;
  }


  const handleOperation = () => {
    if (isEditing.value) {
      doEdit();
    } else {
      doAdd();
    }
  }
</script>

<template>
  <div>
    <div>
      <h2>{{ operationText }}数据</h2>
      <label>标题<input placeholder="请输入标题" v-model.trim="noteInput.title" type="text"></label>
      <label>内容<input placeholder="请输入内容" v-model.trim="noteInput.content" type="text"></label>
      <button @click="handleOperation">{{ operationText }}</button>
    </div>

    <div>
      <h2>注释列表</h2>
      <ul class="note-list" v-if="notes.length > 0">
        <li class="note-list-item" v-for="note in notes" :key="note.id">
          <h3>{{ note.title }}</h3>
          <p>{{ note.content }}</p>
          <button @click="handleDelete($event, note)">删除</button>
          <button @click="handleEdit($event, note)">编辑</button>
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
