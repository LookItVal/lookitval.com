<template>
    <div>
        <div class="heading">
            <GradientText text="DS260: Human Occupancy Detection" header-tag="h1" color="green" />
            <h2 class="subheading">
                Accurate occupancy detection of an office room from light, temperature, humidity and
CO2 measurements using statistical learning models for course DS260 at the Johnson County Comunity College
            </h2>
        </div>
        <div class="body">
            <PlainPDFViewer pdfUrl="https://docs.google.com/document/d/1ncNfI2CgXYYKDJdSAhdsLZnZ_713v7XbsCGhWmbjU8s/export?format=pdf" />
        </div>
    </div>
</template>

<script lang="ts" setup>
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
    height: 100vh;
    padding: 1em 3em 0 3em;
}
</style>