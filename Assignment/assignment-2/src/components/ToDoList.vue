<template>
  <div>
    <div class="mb-3">
      <input
        v-model="newTask"
        class="form-control"
        placeholder="Enter a task..."
        @keyup.enter="addTask"
      />
      <button @click="addTask" class="btn btn-success mt-2">Add Task</button>
    </div>

    <ul class="list-group">
      <li
        v-for="(task, index) in tasks"
        :key="index"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <div>
          {{ task.text }}
          <span class="badge text-dark ms-2">
            ({{ task.priority }})
          </span>
        </div>

        <div>
          <button
            @click="togglePriority(index)"
            class="btn btn-sm bg-warning me-2"
          >
            {{
              task.priority === "High Priority"
                ? "Mark as Low Priority"
                : "Mark as High Priority"
            }}
          </button>
          <button @click="deleteTask(index)" class="btn btn-sm btn-danger">
            Delete
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const newTask = ref("");
    const tasks = ref([]);

    const addTask = () => {
      if (newTask.value.trim()) {
        tasks.value.unshift({
          text: newTask.value.trim(),
          priority: "Low Priority",
        });
        newTask.value = "";
      }
    };

    const deleteTask = (index) => {
      tasks.value.splice(index, 1);
    };

    const togglePriority = (index) => {
      tasks.value[index].priority =
        tasks.value[index].priority === "High Priority"
          ? "Low Priority"
          : "High Priority";
    };

    return {
      newTask,
      tasks,
      addTask,
      deleteTask,
      togglePriority,
    };
  },
};
</script>
