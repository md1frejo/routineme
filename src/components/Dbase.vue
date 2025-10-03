<script setup>
 import { ref, onMounted } from "vue";
 import initSqlJs from "sql.js";

 const db = ref(null);
 const items = ref([]);

 // form inputs
 const newTask = ref("");
 const newTime = ref("");
 const newCompleted = ref("no");

 async function loadDb() {
   const SQL = await initSqlJs({
     locateFile: file => `/${file}` // will load /sql-wasm.wasm
   });

   // load from file (optional: you can also start empty if no today.sqlite exists)
   const response = await fetch("/today.sqlite");
   const buffer = await response.arrayBuffer();

   db.value = new SQL.Database(new Uint8Array(buffer));

   // Ensure table exists with an auto-incrementing id
   db.value.run(`
    CREATE TABLE IF NOT EXISTS today (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tasks TEXT,
      time TEXT,
      completed TEXT
    )
   `);

   refreshItems();
 }

 function refreshItems() {
   if (!db.value) return;
   const res = db.value.exec("SELECT id, tasks, time, completed FROM today");
   if (res.length > 0) {
     const values = res[0].values;
     items.value = values.map(([id, tasks, time, completed]) => ({
       id,
       tasks,
       time,
       completed
     }));
   } else {
     items.value = [];
   }
 }

 function addItem() {
   if (!db.value) return;
   try {
     db.value.run(
       "INSERT INTO today (tasks, time, completed) VALUES (?, ?, ?)",
       [newTask.value, newTime.value, newCompleted.value]
     );
     console.log("Inserted:", newTask.value, newTime.value, newCompleted.value);

     // reset form
     newTask.value = "";
     newTime.value = "";
     newCompleted.value = "no";

     refreshItems();
   } catch (err) {
     console.error("Insert failed:", err);
   }
 }

 function updateItem(item) {
   if (!db.value) return;
   db.value.run(
     "UPDATE today SET tasks = ?, time = ?, completed = ? WHERE id = ?",
     [item.tasks, item.time, item.completed, item.id]
   );
   refreshItems();
 }

 function deleteItem(id) {
   if (!db.value) return;
   db.value.run("DELETE FROM today WHERE id = ?", [id]);
   refreshItems();
 }

 onMounted(loadDb);
</script>

<template>
  <div>
    <!-- Add new task -->
    <div class="add-task text-4xl">
      <input v-model="newTask" placeholder="Task name" />
      <input v-model="newTime" type="time" />
      <select v-model="newCompleted">
        <option value="no">Not Completed</option>
        <option value="yes">Completed</option>
      </select>
      <button @click="addItem">Add Task</button>
    </div>

    <!-- Task list -->
    <ul>
      <li v-for="item in items" :key="item.id">
        <p class="text-db1 text-blue-500">{{ item.tasks }}</p>
        <input v-model="item.time" type="time" />
        <select v-model="item.completed">
          <option value="no">Not Completed</option>
          <option value="yes">Completed</option>
        </select>
        <button @click="updateItem(item)" class="bg-blue-500 btn">Update</button>
        <button @click="deleteItem(item.id)" class="bg-red-500 btn">Delete</button>
      </li>
    </ul>
  </div>
</template>
