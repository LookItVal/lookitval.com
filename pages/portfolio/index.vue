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
    </div>
</template>

<script lang="ts" setup>
const names = ['sml' ,'medium', 'absolutely enormous']

const previousCollectionName = ref(names[0])
const pageTitle = ref(names[1])
const nextCollectionName = ref(names[2])


const dynamicColor = 'cmy';


</script>

<style lang='less' scoped>
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