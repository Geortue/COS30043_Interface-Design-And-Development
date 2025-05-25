<template>
  <div class="page-container">
    <div class="container py-4">
      <h2 class="mb-4">Latest News</h2>

      <!-- Search Filters -->
      <div class="row mb-3">
        <div class="col-md-3">
          <input
            v-model="filters.date"
            type="date"
            class="form-control"
            placeholder="Date"
          />
        </div>
        <div class="col-md-3">
          <input
            v-model="filters.title"
            class="form-control"
            placeholder="Search Title"
          />
        </div>
        <div class="col-md-3">
          <input
            v-model="filters.content"
            class="form-control"
            placeholder="Search Content"
          />
        </div>
        <div class="col-md-3">
          <select v-model="filters.category" class="form-select">
            <option value="">All Categories</option>
            <option v-for="cat in uniqueCategories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>
      </div>

      <!-- Filter Status and Clear Button -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div v-if="filtersApplied" class="text-primary">
          Showing filtered results ({{ filteredNews.length }})
        </div>
        <button
          v-if="filtersApplied"
          class="btn btn-sm btn-outline-secondary"
          @click="clearFilters"
        >
          Clear Filters
        </button>
      </div>

      <!-- News List -->
      <div class="row">
        <div v-for="item in paginatedNews" :key="item.id" class="col-md-6 mb-3">
          <BaseCard>
            <h5>{{ item.title }}</h5>
            <p class="text-muted">
              {{ formatDate(item.date) }} | {{ item.category }}
            </p>
            <p>{{ item.content }}</p>
          </BaseCard>
        </div>
      </div>

      <Pagination
        :currentPage="currentPage"
        :totalPages="totalPages"
        @prev="prevPage"
        @next="nextPage"
        @goToPage="goToPage"
      />
    </div>
  </div>
</template>

<script>
import BaseCard from "../components/BaseCard.vue";
import Pagination from "../components/Pagination.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "News",
  components: { BaseCard, Pagination },
  data() {
    return {
      filters: {
        date: "",
        title: "",
        content: "",
        category: "",
      },
      currentPage: 1,
      pageSize: 4,
    };
  },
  computed: {
    ...mapGetters("news", ["allNews"]),

    uniqueCategories() {
      const categories = this.allNews.map((n) => n.category || "");
      return [...new Set(categories)].filter((c) => c.trim() !== "");
    },

    filteredNews() {
      return this.allNews
        .filter((item) => {
          const matchDate = this.filters.date
            ? new Date(item.date) <= new Date(this.filters.date)
            : true;
          const matchTitle = this.filters.title
            ? item.title
                .toLowerCase()
                .includes(this.filters.title.toLowerCase())
            : true;
          const matchContent = this.filters.content
            ? item.content
                .toLowerCase()
                .includes(this.filters.content.toLowerCase())
            : true;
          const matchCategory = this.filters.category
            ? item.category
                .toLowerCase()
                .includes(this.filters.category.toLowerCase())
            : true;

          return matchDate && matchTitle && matchContent && matchCategory;
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    paginatedNews() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredNews.slice(start, start + this.pageSize);
    },

    totalPages() {
      return Math.ceil(this.filteredNews.length / this.pageSize);
    },

    filtersApplied() {
      return (
        this.filters.date ||
        this.filters.title ||
        this.filters.content ||
        this.filters.category
      );
    },
  },
  methods: {
    ...mapActions("news", ["fetchNews"]),
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    goToPage(page) {
      this.currentPage = page;
    },
    clearFilters() {
      this.filters = {
        date: "",
        title: "",
        content: "",
        category: "",
      };
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      const yyyy = date.getFullYear();
      return `${mm}/${dd}/${yyyy}`;
    },
  },
  watch: {
    filters: {
      deep: true,
      handler() {
        this.currentPage = 1;
      },
    },
  },
  mounted() {
    this.fetchNews();
  },
};
</script>

<style scoped>
.container {
  max-width: 1000px;
}
</style>
