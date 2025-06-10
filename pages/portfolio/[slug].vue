<template>
  <div class="portfolio">
    <div class="header">
      <ShimmeringText :text="`${slug[0].toUpperCase()+slug.substring(1)} Portfolio`" header-tag="h1" color="pyp" />
    </div>
    <div v-if="allPages && allPages.length > 0" class="card-grid">
      <div
        v-for="(page, idx) in allPages"
        :key="page.title"
        class="card card-hidden"
        :ref="el => cardRefs[idx] = el"
      >
        <ShimmeringText
          v-if="tripleGradients.includes(page.color ?? '')"
          :text="page.title"
          header-tag="h2"
          :color="page.color || 'purple'"
          class="card-title"
        />
        <GradientText
          v-else
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
const route = useRoute();
const slug = route.params.slug as string;

const { data: allPagesRaw } = await useAsyncData(`${slug}Portfolio`, () => queryCollection(`${slug}Portfolio` as "academicPortfolio" | "websitePortfolio").all());

const allPages = computed(() => {
  if (!allPagesRaw.value) return [];
  return [...allPagesRaw.value].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
});

const cardRefs = ref<any[]>([]);

onMounted(() => {
  if (!cardRefs.value.length) return;
  cardRefs.value.forEach((el, idx) => {
    if (!el) return;
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
            const card = entry.target as HTMLElement;
            setTimeout(() => {
              card.classList.remove('card-hidden');
              card.classList.add(idx % 2 === 0 ? 'fade-in-left' : 'fade-in-right');
              observer.unobserve(entry.target);
            }, idx * 200);
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -10% 0px'
    });
    observer.observe(el);
  });
});
</script>


<style lang="less" scoped>
.portfolio {
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
      opacity: 1;
      transform: none;
      transition: opacity 0.8s cubic-bezier(0.4,0,0.2,1), transform 0.8s cubic-bezier(0.4,0,0.2,1);
    }
    .card-hidden {
      opacity: 0;
      transform: translateX(0);
    }
    .fade-in-left {
      opacity: 1;
      transform: translateX(0);
      animation: fadeInLeft 0.8s cubic-bezier(0.4,0,0.2,1) forwards;
    }
    .fade-in-right {
      opacity: 1;
      transform: translateX(0);
      animation: fadeInRight 0.8s cubic-bezier(0.4,0,0.2,1) forwards;
    }
    @keyframes fadeInLeft {
      from {
        opacity: 0;
        transform: translateX(-60vw);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    @keyframes fadeInRight {
      from {
        opacity: 0;
        transform: translateX(60vw);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    .card-title {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      width: 100%;
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
</style>