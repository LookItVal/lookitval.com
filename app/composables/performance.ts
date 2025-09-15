import { ref, readonly } from 'vue';

const webGLSupported = ref(true);
const highFramerate = ref(true);
const highPerformance = computed(() => webGLSupported.value && highFramerate.value);
const isPerformanceCalculated = ref(false);

export const usePerformance = () => {
  const calculatePerformance = (measurementDuration: number = 2000, measurementDelay: number = 500) => {
    if (typeof window === 'undefined') return Promise.resolve();
    return new Promise<void>(async (resolve) => {
      await new Promise(r => setTimeout(r, measurementDelay));
      // Check WebGL support
      webGLSupported.value = !!window.WebGLRenderingContext;
      
      let frameCount = 0;
      const startTime = performance.now();

      function countFrame() {
        frameCount++;
        const now = performance.now();
        if (now - startTime < measurementDuration) {
          requestAnimationFrame(countFrame);
        } else {
          const avgFps = frameCount / ((now - startTime) / 1000);
          highFramerate.value = avgFps > 45;
          isPerformanceCalculated.value = true;
          resolve();
        }
      }
      requestAnimationFrame(countFrame);
    });
  };

  return {
    highPerformance: readonly(highPerformance),
    isPerformanceCalculated: readonly(isPerformanceCalculated),
    calculatePerformance
  };
};
