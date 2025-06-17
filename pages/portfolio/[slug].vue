<template>
  <div class="portfolio">
    <div class="header">
      <div class="previous-collection">
        <div
          :class="{ 'selected-collection': isPreviousSelected }"
          @click="selectPreviousCollection"
          style="cursor: pointer;"
        >          <ShimmeringText
            :text="previousCollectionName"
            header-tag="h2"
            color="grey"
          />
        </div>
      </div>
      <div class="title">
        <ShimmeringText :text="pageTitle" header-tag="h1" :color="dynamicColor" class="text" />
      </div>
      <div class="next-collection">
        <div
          :class="{ 'selected-collection': isNextSelected }"
          @click="selectNextCollection"
          style="cursor: pointer;"
        >
          <ShimmeringText
            :text="nextCollectionName"
            header-tag="h2"
            color="grey"
          />
        </div>
      </div>
    </div>
    <div v-if="allPages && allPages.length > 0" class="card-grid">
      <div
        v-for="(subPage, idx) in allPages"
        :key="subPage.title"
        class="card"
        :class="idx % 2 === 0 ? 'even' : 'odd'"
        :style="{ transitionDelay: `${idx * 50}ms` }"
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
definePageMeta({
  pageTransition: {
    name: 'portfolio',
    mode: 'out-in',
    onEnter(el, done) {
      setTimeout(() => {
        done();
      }, 50);
    },
    onLeave(el, done) {
      setTimeout(() => {
        done();
      }, 600);
    }
  }
});

import type { CollectionName } from '~/utils/constants';
import { collectionNames } from '~/utils/constants'; // Ensure this exports all valid collection names as an array

const route = useRoute();
const slug = route.params.slug as string;

const router = useRouter();


const collectionName = ref(`${slug}Portfolio` as CollectionName);
const pageTitle = ref(`${collectionName.value[0].toUpperCase()}${collectionName.value.slice(1).replace('Portfolio', ' Portfolio')}`);

const collectionIndex = computed(() => collectionNames.indexOf(collectionName.value));
watchEffect(() => {
  if (collectionIndex.value === -1) {
    router.replace('/404');
  }
});

const previousCollection = computed(() =>
  collectionNames[
    collectionIndex.value === 0
      ? collectionNames.length - 1
      : collectionIndex.value - 1
  ]
);

const nextCollection = computed(() =>
  collectionNames[
    collectionIndex.value === collectionNames.length - 1
      ? 0
      : collectionIndex.value + 1
  ]
);

const previousCollectionName = computed(() =>
  previousCollection.value[0].toUpperCase() +
  previousCollection.value.slice(1).replace('Portfolio', ' Portfolio')
);

const nextCollectionName = computed(() =>
  nextCollection.value[0].toUpperCase() +
  nextCollection.value.slice(1).replace('Portfolio', ' Portfolio')
);
const selectedCollectionName = ref<string>("Academic Portfolio");
const previousCollectionPage = computed(() =>
  allPortfolioPages.value?.find(
    p => p.path === `portfolio/${previousCollection.value}`
  )
);
const nextCollectionPage = computed(() =>
  allPortfolioPages.value?.find(
    p => p.path === `portfolio/${nextCollection.value}`
  )
);
const previousCollectionColor = computed(() =>
  previousCollectionPage.value?.dynamicColor || 'cmy'
);
const nextCollectionColor = computed(() =>
  nextCollectionPage.value?.dynamicColor || 'cmy'
);


const previousURL = computed(() =>
  `/portfolio/${previousCollection.value.replace('Portfolio', '')}/`
);

const nextURL = computed(() =>
  `/portfolio/${nextCollection.value.replace('Portfolio', '')}/`
);


const isPreviousSelected = ref(false);
const isNextSelected = ref(false);
function selectPreviousCollection() {
  isPreviousSelected.value = true;
  selectedColor.value = previousCollectionColor.value;
  selectedCollectionName.value = previousCollectionName.value;
  router.push(previousURL.value);
}
function selectNextCollection() {
  isNextSelected.value = true;
  selectedColor.value = nextCollectionColor.value;
  selectedCollectionName.value = nextCollectionName.value;
  router.push(nextURL.value);
}



const { data: allPortfolioPages } = await useAsyncData(`portfolioPage`, () => queryCollection('portfolioPage').all());
const page = computed(() => {
  return allPortfolioPages.value?.find(p => p.collection === `${collectionName.value}`);
});

const staticColor = computed(() => {
  return (page.value?.staticColor) || 'purple';
});
const dynamicColor = computed(() => {
  if (setDynamicColor.value !== "") {
    return setDynamicColor.value;
  } 
  return page.value?.dynamicColor || 'cmy';
});
const setDynamicColor = ref<string>("");
const selectedColor = ref<string>(dynamicColor.value);

const { data: allPagesRaw } = await useAsyncData(collectionName.value, () => queryCollection(collectionName.value)
                                                                           .where('visible', '=', true)
                                                                           .all());

const allPages = computed(() => {
  if (!allPagesRaw.value) return [];
  return [...allPagesRaw.value]
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
});

onUnmounted(() => {
  setTimeout(() => {
    setDynamicColor.value = selectedColor.value;
    pageTitle.value = selectedCollectionName.value;
  }, 350);
});
  
</script>


<style lang="less" scoped>
.portfolio-enter-active,
.portfolio-leave-active {
  transition: all 0.5s ease-in-out;

  .header {
    .previous-collection:not(.selected-collection), .next-collection:not(.selected-collection) {
      transition: all 0.25s ease-in-out;
    }
  }

  .card {
    transition: all 0.5s ease-in-out;
  }

  &:not(.portfolio-enter-to, .portfolio-leave-to) .card {
    opacity: 0;
  }
}


.portfolio-leave-to {
  .header {
    .title .text {
      animation: titleFadeOut 0.5s ease-in-out forwards;
      @keyframes titleFadeOut {
        0% {
          opacity: 1;
          transform: translateY(0);
        }
        50% {
          opacity: 0;
          transform: translateY(2em);
        }
        75% {
          opacity: 0;
          transform: translateY(0);
        }
        100% {
          opacity: 0;
          transform: translateY(0);
        }
      }
    }
    .previous-collection:not(.selected-collection) {
      opacity: 0;
      transform: translate(-2.5em, 2em);
    }

    .next-collection:not(.selected-collection) {
      opacity: 0;
      transform: translate(2.5em, 2em);
    }
  }

  .card.even {
    opacity: 0;
    transform: translateX(-20em);
  }
  .card.odd {
    opacity: 0;
    transform: translateX(20em);
  }
}

.portfolio-enter-to {
  .header {
    .next-collection {
      opacity: 0;
      transform: translate(2.5em, 2em);
    }
    
    .previous-collection {
      opacity: 0;
      transform: translate(-2.5em, 2em);
    }
  }

  .card {
    transition-duration: 0s !important;
    transition-delay: 0s !important;

    &.even {
      opacity: 0;
      transform: translateX(-20em);
    }
    &.odd {
      opacity: 0;
      transform: translateX(20em);
    }
  }
}


.portfolio {
  padding-top: 5rem; 

  .header {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    margin-bottom: 2rem; /* Adjust as needed */

    .title {
      width: 40vw;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .previous-collection {
      width: 30vw;
      transform: translate(-2em, 1em);
      text-align: -webkit-right;
    }
    .next-collection {
      width: 30vw;
      transform: translate(2em, 1em);
      text-align: -webkit-left;
    }
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

      transition: all 0.5s ease-in-out;

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
}
</style>