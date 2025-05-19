<template>
    <div>
        <div class="heading">
            <GradientText :text="pageTitle" header-tag="h1" :color="pageColor" />
            <h2 class="subheading">
                {{ pageDescription }}
            </h2>
        </div>
        <div class="body"> 
            <ContentRenderer v-if="page" :value="page" style="width: 100%;" />
            <div v-else>Page not found :(</div>
        </div>
        <div class="footer">
            <GradientButton :to="`/portfolio/academic/${previousSlug}`" class="previous-button" :color="pageColor">
                <h3><- {{ previousSlug }}</h3>
            </GradientButton>
            <GradientButton :to="`/portfolio/academic/${nextSlug}`" class="next-button" :color="pageColor">
                <h3>{{ nextSlug }} -></h3>
            </GradientButton>
        </div>
    </div>
</template>

<script lang="ts" setup>
const route = useRoute();
const slug = route.params.slug as string;
const { data: page } = await useAsyncData(`academic-${slug}`, () => {
    return queryCollection('entry').path(`/portfolio/academic/${slug}`).first();
});

// Fetch all markdown files in the folder
const { data: allPages } = await useAsyncData('academic-pages', () => {
    return queryCollection('entry').all();
});

// Find the current page index
const currentIndex = computed(() => {
    return allPages.value?.findIndex((p: any) => p.path.endsWith(`/${slug}`));
});


// Determine previous and next slugs
const previousSlug = computed(() => {
    const index = currentIndex.value ?? -1;
    return index > 0 ? allPages.value?.[index - 1]?.path.split('/').pop() : allPages.value?.[allPages.value?.length - 1]?.path.split('/').pop();
});
const nextSlug = computed(() => {
    const index = currentIndex.value ?? -1;
    return index < (allPages.value?.length ?? 0) - 1 ? allPages.value?.[index + 1]?.path.split('/').pop() : allPages.value?.[0]?.path.split('/').pop();
});

const pageTitle = computed(() => {
    return page.value?.title || slug.charAt(0).toUpperCase() + slug.slice(1);
});
const pageDescription = computed(() => {
    return page.value?.description || 'Something isnt right...';
});
const pageColor = computed(() => {
    return (page.value as { color?: string })?.color || 'green';
});

useSeoMeta({
    title: page.value?.title || 'Academic Portfolio',
    description: page.value?.description || 'Explore my academic portfolio.'
});
</script>

<style lang="less" scoped>
.heading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3em 3em 2em 3em;
    text-align: center;
    margin-bottom: 20px;
    gap: 1em;

    h1 {
        font-size: 2.5em;
        margin-bottom: 10px;
    }

    .subheading {
        font-size: 1.2em;
    }
}
.body {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1em 3em 0 3em;
}
.footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1em 3em;

    .next-button {
        height: 2em;
        width: 10em;        
    }
    .previous-button {
        height: 2em;
        width: 10em;
    }
}
</style>