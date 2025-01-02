<template>
    <div class="the-wunsch">
        <WunschBalloon ref="balloon"/>
        <WunschColorShift ref="colorShift"/>
        <WunschPick3 ref="pick3"/>
    </div>
</template>


<script lang="ts" setup>
const wunsch = 'wunsch';
const letterIndex: Ref<number> = ref(0);
const balloon: Ref<WunschBalloon | null> = ref(null);
const colorShift: Ref<WunschColorShift | null> = ref(null);
const pick3: Ref<WunschPick3 | null> = ref(null);
const appConfig = useAppConfig();
const runCommands = Array(4).fill(false);

function run(): void {
    const commands = [
        balloon.value!.animateBalloon,
        colorShift.value!.shift,
        () => appConfig.animateFlamingos.forEach((animateFlamingo: Function) => animateFlamingo()),
        pick3.value!.animate
    ];
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * commands.length);
    } while (runCommands[randomIndex]);
    runCommands[randomIndex] = true;
    commands[randomIndex]!();
    if (runCommands.every(command => command)) {
        runCommands.fill(false);
    }
}

function handleKeydown(event: KeyboardEvent): void {
    if (event.key && event.key.toLowerCase() === wunsch[letterIndex.value]) {
        letterIndex.value++;
        if (letterIndex.value === wunsch.length) {
            run();
            letterIndex.value = 0;
        }
    } else {
        letterIndex.value = 0;
    }
}

onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown);
});
</script>