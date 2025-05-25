<template>
  <nav aria-label="Page navigation">
    <ul class="pagination justify-content-center">
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <button
          class="page-link"
          @click="$emit('prev')"
          :disabled="currentPage === 1"
        >
          Prev
        </button>
      </li>

      <li
        v-for="page in visiblePages"
        :key="page"
        class="page-item"
        :class="{ active: page === currentPage }"
      >
        <button class="page-link" @click="$emit('goToPage', page)">
          {{ page }}
        </button>
      </li>

      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <button
          class="page-link"
          @click="$emit('next')"
          :disabled="currentPage === totalPages"
        >
          Next
        </button>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "Pagination",
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
    maxVisible: {
      type: Number,
      default: 5,
    },
  },
  computed: {
    visiblePages() {
      const half = Math.floor(this.maxVisible / 2);
      let start = Math.max(this.currentPage - half, 1);
      let end = start + this.maxVisible - 1;

      if (end > this.totalPages) {
        end = this.totalPages;
        start = Math.max(end - this.maxVisible + 1, 1);
      }

      const pages = [];
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    },
  },
};
</script>

<style scoped>
.page-item.active .page-link {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}
</style>
