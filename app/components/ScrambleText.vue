<script setup lang="ts">
const { text, maxIterations = 8, speed = 45 } = defineProps<{
  text: string;
  maxIterations?: number;
  speed?: number;
}>();

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+";
const displayText = ref(text);
const prefersReducedMotion = ref(false);
let interval: ReturnType<typeof setInterval> | undefined;

const clearScramble = () => {
  if (interval) {
    clearInterval(interval);
    interval = undefined;
  }
};

const scramble = () => {
  if (prefersReducedMotion.value) {
    displayText.value = text;
    return;
  }

  clearScramble();

  let iterations = 0;
  interval = setInterval(() => {
    displayText.value = text
      .split("")
      .map((character) => {
        if (character === " ") return " ";
        return characters[Math.floor(Math.random() * characters.length)] ?? character;
      })
      .join("");

    iterations += 1;

    if (iterations >= maxIterations) {
      clearScramble();
      displayText.value = text;
    }
  }, speed);
};

onMounted(() => {
  prefersReducedMotion.value = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
});

onBeforeUnmount(clearScramble);
</script>

<template>
  <span
    class="inline-block whitespace-pre-wrap"
    @mouseenter="scramble"
    @focus="scramble"
  >
    <span class="sr-only">{{ text }}</span>
    <span aria-hidden="true">{{ displayText }}</span>
  </span>
</template>
