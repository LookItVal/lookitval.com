<template>
  <div class="portfolio">
    <div class="header">
      <div class="previous-collection">
        <div
          :class="isPreviousSelected ? 'selected-collection' : 'unselected-collection'"
          @click="selectPreviousCollection"
          style="cursor: pointer;"
        >
          <ShimmeringText
            :text="previousCollectionName"
            header-tag="h2"
            color="grey"
            :id="isPreviousSelected ? 'selectedCollection' : ''"
            :style="isPreviousSelected ? {transform: `translate(calc(${translateX}px + 3.2em), -0.49em) scale(${scaleX}, ${scaleY})`, transition: 'transform 0.5s ease-in-out'} : {}"
          />
        </div>
      </div>
      <div class="title">
        <ShimmeringText :text="pageTitle" header-tag="h1" :color="dynamicColor" class="text" />
        <ShimmeringText :text="selectedCollectionName" header-tag="h1" :color="selectedColor" class="shadow" id="nextTitle"/>
      </div>
      <div class="next-collection">
        <div
          :class="isNextSelected ? 'selected-collection' : 'unselected-collection'"
          @click="selectNextCollection"
          style="cursor: pointer;"
        >
          <ShimmeringText
            :text="nextCollectionName"
            header-tag="h2"
            color="grey"
            :id="isNextSelected ? 'selectedCollection' : ''"
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
      }, 6000000);
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

const firstX = ref(document.querySelector('#selectedCollection')?.getBoundingClientRect().x || 0);
const firstY = ref(document.querySelector('#selectedCollection')?.getBoundingClientRect().y || 0);
const firstWidth = ref(document.querySelector('#selectedCollecion')?.getBoundingClientRect().width || 0);
const firstHeight =ref(document.querySelector('#selectedCollecion')?.getBoundingClientRect().height || 0);
const lastX = ref(document.querySelector('#nextTitle')?.getBoundingClientRect().x || 0);
const lastY = ref(document.querySelector('#nextTitle')?.getBoundingClientRect().y || 0);
const lastWidth = ref(document.querySelector('#nextTitle')?.getBoundingClientRect().width || 0);
const lastHeight = ref(document.querySelector('#nextTitle')?.getBoundingClientRect().height || 0);
const translateX = computed(() => {
  return lastX.value - firstX.value;
});
const translateY = computed(() => {
  return lastY.value - firstY.value;
});
const scaleX = computed(() => {
  return lastWidth.value / firstWidth.value;
});
const scaleY = computed(() => {
  return lastHeight.value / firstHeight.value;
});

function updateTitleValues() {
  firstX.value = document.querySelector('#selectedCollection')?.getBoundingClientRect().x || 0;
  firstY.value = document.querySelector('#selectedCollection')?.getBoundingClientRect().y || 0;
  firstWidth.value = document.querySelector('#selectedCollection')?.getBoundingClientRect().width || 0;
  firstHeight.value = document.querySelector('#selectedCollection')?.getBoundingClientRect().height || 0;
  lastX.value = document.querySelector('#nextTitle')?.getBoundingClientRect().x || 0;
  lastY.value = document.querySelector('#nextTitle')?.getBoundingClientRect().y || 0;
  lastWidth.value = document.querySelector('#nextTitle')?.getBoundingClientRect().width || 0;
  lastHeight.value = document.querySelector('#nextTitle')?.getBoundingClientRect().height || 0;
}
async function selectPreviousCollection() {
  isPreviousSelected.value = true;
  selectedColor.value = previousCollectionColor.value;
  selectedCollectionName.value = previousCollectionName.value;
  await nextTick();
  await nextTick();
  await nextTick();
  await nextTick();
  updateTitleValues();
  await nextTick();
  router.push(previousURL.value);
}
async function selectNextCollection() {
  isNextSelected.value = true;
  selectedColor.value = nextCollectionColor.value;
  selectedCollectionName.value = nextCollectionName.value;
  await nextTick();
  await nextTick();
  await nextTick();
  updateTitleValues();
  await nextTick();
  router.push(nextURL.value);
}


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
      animation: titleFadeOut 0.25s ease-in-out forwards;
      @keyframes titleFadeOut {
        0% {
          opacity: 1;
          transform: translateY(0);
        }
        100% {
          opacity: 0;
          transform: translateY(2em);
        }
      }
    }
    .previous-collection {
      .unselected-collection {
        opacity: 0;
        transform: translate(-2.5em, 2em);
      }
      .selected-collection {
        opacity: 1;
        transform: translate(var(--translateX), var(--translateY)) scale(var(--scaleX), var(--scaleY));
      }
    }

    .next-collection {
      .unselected-collection {
        opacity: 0;
        transform: translate(2.5em, 2em);
      }
      .selected-collection {
        opacity: 1;
        transform: translate(var(--translateX), var(--translateY)) scale(var(--scaleX), var(--scaleY));
      }
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

      .shadow {
        position: absolute;
        opacity: 0.5;
      }
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