<template>
  <div class="portfolio">
    <div class="header">
      <div class="previous-collection">
        <ShimmeringText
          :text="previousCollectionName"
          header-tag="h2"
          color="grey"
        />
      </div>
      <ShimmeringText :text="pageTitle" header-tag="h1" :color="dynamicColor" />
      <div class="next-collection">
        <ShimmeringText
          :text="nextCollectionName"
          header-tag="h2"
          color="grey"
        />
      </div>
    </div>
    <div v-if="allPages && allPages.length > 0" class="card-grid">
      <div
        v-for="(subPage, idx) in allPages"
        :key="subPage.title"
        class="card card-hidden"
        :ref="el => cardRefs[idx] = el"
      >
        <ShimmeringText
          v-if="tripleGradients.includes(subPage.color ?? '')"
          :text="subPage.title"
          header-tag="h2"
          :color="subPage.color || 'purple'"
          class="card-title"
        />
        <GradientText
          v-else
          :text="subPage.title"
          header-tag="h2"
          :color="subPage.color || 'purple'"
          class="card-title"
        />
        <p v-if="subPage.description" class="card-description">{{ subPage.description }}</p>
        <div class="card-link">
          <GradientButton
            :to="subPage.URL || `/portfolio/academic/${subPage.path.split('/').pop()}`"
            class="view-button"
            :color="staticColor">
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
import type { CollectionName } from '~/utils/constants';
import { collectionNames } from '~/utils/constants'; // Ensure this exports all valid collection names as an array

const route = useRoute();
const slug = route.params.slug as string;

const router = useRouter();

// Check if `${slug}Portfolio` is a valid CollectionName
const collectionName = `${slug}Portfolio` as CollectionName;
const collectionIndex = collectionNames.indexOf(collectionName as CollectionName);
if (collectionIndex === -1) {
  router.replace('/404');
}

const previousCollection = collectionNames[
  collectionIndex === 0 ? collectionNames.length - 1 : collectionIndex - 1
];
const nextCollection = collectionNames[
  collectionIndex === collectionNames.length - 1 ? 0 : collectionIndex + 1
];
const previousCollectionName = previousCollection[0].toUpperCase() + previousCollection.slice(1).replace('Portfolio', ' Portfolio');
const nextCollectionName = nextCollection[0].toUpperCase() + nextCollection.slice(1).replace('Portfolio', ' Portfolio');
  

const { data: page } = await useAsyncData(`portfolioPage`, () => queryCollection('portfolioPage').path(`/portfolio/${slug}`).first());

const pageTitle = computed(() => {
  return page.value?.title || `${slug[0].toUpperCase() + slug.substring(1)} Portfolio`;
});
const staticColor = computed(() => {
  return (page.value?.staticColor) || 'purple';
});
const dynamicColor = computed(() => {
  return (page.value as { dynamicColor?: string })?.dynamicColor || 'cmy';
});

const { data: allPagesRaw } = await useAsyncData(collectionName, () => queryCollection(collectionName)
                                                                           .where('visible', '=', true)
                                                                           .all());

const allPages = computed(() => {
  if (!allPagesRaw.value) return [];
  return [...allPagesRaw.value]
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
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