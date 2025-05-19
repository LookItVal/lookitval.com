<template>
  <div class="academic-portfolio">
    <div class="header">
      <GradientText text="Academic Portfolio" header-tag="h1" color="orange" />
    </div>
    <div v-if="allPages && allPages.length > 0" class="card-grid">
      <div v-for="page in allPages" :key="page.title" class="card">
        <h2 v-if="page.title" class="card-title">{{ page.title }}</h2>
        <p v-if="page.description" class="card-description">{{ page.description }}</p>
        <div class="link">
          <GradientButton
            :to="`/portfolio/academic/${page.path.split('/').pop()}`"
            class="view-button"
            color="blue">
            <h4 style="font-weight: 900;">View</h4>
          </GradientButton>
        </div>
      </div>
    </div>
    <div v-else-if="allPages && allPages.length === 0">
      <p>No academic entries found.</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { data: allPages } = await useAsyncData('academic-pages', () => {
    return queryCollection('entry').all();
});
</script>

<style lang="less" scoped>
.academic-portfolio {
  padding-top: 5rem; 
}

.header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem; /* Adjust as needed */
}

.card-grid {
  display: grid;
  gap: 1rem; /* Adjust gap as needed */
  
  /* Mobile: 3 columns (as requested) */
  grid-template-columns: repeat(3, 1fr);
}

/* Larger screens (e.g., tablets and desktops): 2 columns */
@media (min-width: 768px) { /* Adjust breakpoint as needed */
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.card {
  border: 1px solid #e2e8f0; /* Example border color */
  border-radius: 0.375rem; /* Example border radius */
  padding: 1rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); /* Example shadow */

  .link {
    width: 5em; 
    height: 3em;
    padding: 1em 1em 0em 0;

    .button-background {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

}

.card-title {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600; 
}

.card-description {
  font-size: 1rem;
  margin-bottom: 0;
}

</style>