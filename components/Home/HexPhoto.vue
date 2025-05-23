<template>
    <div class="hex-container" ref="hexContainer">
        <svg viewBox="-5 -5 110 110" class="hex-svg">
            <defs>
                <mask id="hexMask">
                    <path d="M 7.565 50
                             L 7.565 33
                             C 7.565 25.5 7.565 25.5 14.06 21.75
                             L 43.25 4.6
                             C 50 1 50 1 56.75 4.6
                             L 85.94 21.75
                             C 92.435 25.5 92.435 25.5 92.435 33
                             L 92.435 67
                             C 92.435 74.5 92.435 74.5 85.94 78.25
                             L 56.75 95.4
                             C 50 99 50 99 43.25 95.4
                             L 14.06 78.25
                             C 7.565 74.5 7.565 74.5 7.565 67
                             Z" fill="white" filter="url(#roundCorners)"/>
                </mask>
            </defs>
            <path class="glowing-shape" d="M 7.565 50
                                           L 7.565 33
                                           C 7.565 25.5 7.565 25.5 14.06 21.75
                                           L 43.25 4.6
                                           C 50 1 50 1 56.75 4.6
                                           L 85.94 21.75
                                           C 92.435 25.5 92.435 25.5 92.435 33
                                           L 92.435 67
                                           C 92.435 74.5 92.435 74.5 85.94 78.25
                                           L 56.75 95.4
                                           C 50 99 50 99 43.25 95.4
                                           L 14.06 78.25
                                           C 7.565 74.5 7.565 74.5 7.565 67
                                           Z" fill="none" stroke-width="2" stroke="url(#greenGradient)" />
            <g class="image-mask" mask="url(#hexMask)">
                <image class="hex-image background-image" ref="backgroundImage" href="~assets/Home/SoundGirlBackground.jpg" width="110%" height="110%" />
                <image class="hex-image foreground-image" ref="foregroundImage" href="~assets/Home/SoundGirlRoto.png" width="115%" height="115%" />
            </g>
        </svg>
    </div>
</template>


<script lang="ts" setup>
const foregroundImage: Ref<HTMLElement | null> = ref(null);
const hexContainer: Ref<HTMLElement | null> = ref(null);

function handleScroll(): void {
    const scrollValue = window.scrollY;
    const foregroundTranslateY = 10 + scrollValue * -0.01;
    (foregroundImage.value as HTMLElement).style.transform = `translateY(${foregroundTranslateY}px) translateX(-15px)`;
}

onMounted(() => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                hexContainer.value!.classList.add('animate-entrance');
                observer.unobserve(entry.target);
                setTimeout(() => {
                    hexContainer.value!.classList.add('animate');
                }, 1000);
            }
        });
    }, { threshold: 0.1 });

    if (hexContainer.value) {
        observer.observe(hexContainer.value);
    }

    window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>


<style lang="less" scoped>
.hex-container {
    position: relative;
    height: 100%;
    aspect-ratio: 1;

    .hex-svg {
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        .glowing-shape {
            transform: translateY(10px);
            opacity: 0;
            transition: transform 1s, opacity 1s ease-out;
        }
        .image-mask {
            transform: translateY(20px) scale(0.9) translateX(5.5px); 
            opacity: 0;
            transition: transform 1s, opacity 1s ease-out;

            .background-image {
                transform: translateY(-5px) translateX(-10px);
                transition: transform 1s ease-out;
            }
            .foreground-image {
                transform: translateY(5px) translateX(-15px);
                transition: transform .5s ease-out;
            }
        }
    }
}

.hex-container.animate-entrance .hex-svg {
    .glowing-shape {
        transform: translateY(-0.5px);
        opacity: 1;
    }
    .image-mask {
        transform: translateY(5px) scale(0.9) translateX(5.5px);
        opacity: 1;

        .background-image {
            transform: translateY(0) translateX(-10px);
        }
    }
}

.hex-container.animate-entrance.animate {
    .glowing-shape {
        animation: hover 2.5s infinite ease-in-out;
    }
}

@keyframes hover {
    0% {
        transform: translateY(-0.5px);
    }
    50% {
        transform: translateY(0.5px);
    }
    100% {
        transform: translateY(-0.5px);
    }
}
</style>