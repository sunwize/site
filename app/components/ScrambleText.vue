<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    text: string;
    maxIterations?: number;
    speed?: number;
  }>(),
  {
    maxIterations: 8,
    speed: 45,
  },
);

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+";
const displayText = ref(props.text);
let interval: ReturnType<typeof setInterval> | undefined;

const clearScramble = () => {
  if (interval) {
    clearInterval(interval);
    interval = undefined;
  }
};

const scramble = () => {
  clearScramble();

  let iterations = 0;
  interval = setInterval(() => {
    displayText.value = props.text
      .split("")
      .map((character) => {
        if (character === " ") return " ";
        return characters[Math.floor(Math.random() * characters.length)] ?? character;
      })
      .join("");

    iterations += 1;

    if (iterations >= props.maxIterations) {
      clearScramble();
      displayText.value = props.text;
    }
  }, props.speed);
};

onBeforeUnmount(clearScramble);
</script>

<template>
  <span class="inline-block whitespace-pre-wrap" @mouseenter="scramble" @focus="scramble">
    {{ displayText }}
  </span>
</template>
