<template>
  <div id="app">
    <NavBar />
    <main class="pt-5 mt-4">
      <router-view />
    </main>
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";
export default {
  name: "App",
  components: {
    NavBar,
  },
};
</script>

<style>
body {
  background: linear-gradient(to right, #f4f8ff, #ecfdf5);
}

.btn-gradient {
  background: linear-gradient(to right, #4e54c8, #8f94fb);
  color: white;
  font-weight: 500;
  border: none;
}

.btn-gradient:hover {
  background: linear-gradient(to right, #5d63d4, #a4a9ff);
}

main {
  padding-top: 80px;
}
</style>
