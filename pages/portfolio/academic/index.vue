<template>
  <div class="academic-portfolio">
    <div class="header">
      <GradientText text="Academic Portfolio" header-tag="h1" color="rainbow" />
    </div>
    <div v-if="allPages && allPages.length > 0" class="card-grid">
      <div v-for="page in allPages" :key="page.title" class="card">
        <GradientText
          :text="page.title"
          header-tag="h2"
          :color="page.color || 'purple'"
          class="card-title"
        />
        <p v-if="page.description" class="card-description">{{ page.description }}</p>
        <div class="card-link">
          <GradientButton
            :to="`/portfolio/academic/${page.path.split('/').pop()}`"
            class="view-button"
            :color="'purple'">
            <h4>View</h4>
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

  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 2rem; /* Adjust as needed */
  }

  .card-grid {
    display: grid;
    padding: 1rem;
    gap: 1rem;
    grid-template-columns: repeat(2, 1fr);
    
    .card {
      border-radius: 0.375rem; /* Example border radius */
      background-color: var(--base);
      padding: 1rem;

      .card-title {
        display: flex;
        flex-direction: row;
        gap: 0.75rem;
        margin-top: 0;
        margin-bottom: 0.5rem;
        font-size: 1.25rem;
        font-weight: 600; 
      }

      .card-description {
        font-size: 1.5rem;
        margin-bottom: 0;
      }

      .card-link {
        width: 5em; 
        height: 3em;
        padding: 1em 1em 0 0;

        .button-background {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
}
</style>