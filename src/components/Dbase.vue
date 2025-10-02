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

   const response = await fetch("/today.sqlite");
   const buffer = await response.arrayBuffer();

   db.value = new SQL.Database(new Uint8Array(buffer));

   // Ensure table exists
   db.value.run(`
    CREATE TABLE IF NOT EXISTS today (
      tasks TEXT PRIMARY KEY,
      time TEXT,
      completed TEXT
    )
   `);

   refreshItems();
 }

 function refreshItems() {
   if (!db.value) return;
   const res = db.value.exec("SELECT tasks, time, completed FROM today");
   if (res.length > 0) {
     const values = res[0].values;
     items.value = values.map(([tasks, time, completed]) => ({
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
     db.value.run("INSERT INTO today (tasks, time, completed) VALUES (?, ?, ?)", [
       newTask.value,
       newTime.value,
       newCompleted.value
     ]);
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
     "UPDATE today SET time = ?, completed = ? WHERE tasks = ?",
     [item.time, item.completed, item.tasks]
   );
   refreshItems();
 }

 function deleteItem(task) {
   if (!db.value) return;
   db.value.run("DELETE FROM today WHERE tasks = ?", [task]);
   refreshItems();
 }

 onMounted(loadDb);
</script>

<template>
  
  <div>
    <h1>SQLite in Vue + WebAssembly</h1>

    <!-- Add new task -->
    <div class="add-task">
      <input v-model="newTask" placeholder="Task (unique)" />
      <input v-model="newTime" type="time" />
      <select v-model="newCompleted">
        <option value="no">Not Completed</option>
        <option value="yes">Completed</option>
      </select>
      <button @click="addItem">Add Task</button>
    </div>

    <!-- Task list -->
    <ul>
      <li v-for="item in items" :key="item.tasks">
        <strong>{{ item.tasks }}</strong>
        <input v-model="item.time" type="time" />
        <select v-model="item.completed">
          <option value="no">Not Completed</option>
          <option value="yes">Completed</option>
        </select>

        <button @click="updateItem(item)">Update</button>
        <button @click="deleteItem(item.tasks)">Delete</button>
      </li>
    </ul>
    <button class="bg-green4g-300 btn btn-primary">daisy? Click me</button>
    <details class="dropdown">
      <summary class="btn m-1">daisy dropdown</summary>
      <ul class="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
	<li><a>Item 1</a></li>
	<li><a>Item 2</a></li>
      </ul>
    </details>
    <ul class="menu menu-vertical lg:menu-horizontal bg-base-200 rounded-box">
      <li><a>Item 1</a></li>
      <li><a>Item 2</a></li>
      <li><a>Item 3</a></li>
    </ul>
    <p class="text-db1">tabs</p>
    <div role="tablist" class="tabs tabs-lift tabs-xs">
      <a role="tab" class="tab">Xsmall</a>
      <a role="tab" class="tab tab-active">Xsmall</a>
      <a role="tab" class="tab">Xsmall</a>
    </div>
    
    <div role="tablist" class="tabs tabs-lift tabs-sm">
      <a role="tab" class="tab">Small</a>
      <a role="tab" class="tab tab-active">Small</a>
      <a role="tab" class="tab">Small</a>
    </div>
    
    <div role="tablist" class="tabs tabs-lift">
      <a role="tab" class="tab">Medium</a>
      <a role="tab" class="tab tab-active">Medium</a>
      <a role="tab" class="tab">Medium</a>
    </div>
    
    <div role="tablist" class="tabs tabs-lift tabs-lg">
      <a role="tab" class="tab">Large</a>
      <a role="tab" class="tab tab-active">Large</a>
      <a role="tab" class="tab">Large</a>
    </div>
    
    <div role="tablist" class="tabs tabs-lift tabs-xl">
      <a role="tab" class="tab">Xlarge</a>
      <a role="tab" class="tab tab-active">Xlarge</a>
      <a role="tab" class="tab">Xlarge</a>
    </div>
  </div>
</template>
