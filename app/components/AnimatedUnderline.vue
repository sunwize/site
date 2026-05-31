<script setup lang="ts">
const {
  label,
  alwaysShowOnMobile = false,
  underlineHeightRatio = 0.1,
  underlinePaddingRatio = 0.01,
} = defineProps<{
  label: string;
  alwaysShowOnMobile?: boolean;
  underlineHeightRatio?: number;
  underlinePaddingRatio?: number;
}>();

const textRef = ref<HTMLSpanElement | null>(null);
const isTouchDevice = ref(false);

const updateUnderlineStyles = () => {
  if (!textRef.value) return;

  const fontSize = Number.parseFloat(getComputedStyle(textRef.value).fontSize);
  textRef.value.style.setProperty(
    "--underline-height",
    `${fontSize * underlineHeightRatio}px`
  );
  textRef.value.style.setProperty(
    "--underline-padding",
    `${fontSize * underlinePaddingRatio}px`
  );
};

const updateTouchDevice = () => {
  isTouchDevice.value = window.matchMedia("(hover: none)").matches;
};

onMounted(() => {
  updateUnderlineStyles();
  updateTouchDevice();
  window.addEventListener("resize", updateUnderlineStyles);
  window.addEventListener("resize", updateTouchDevice);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateUnderlineStyles);
  window.removeEventListener("resize", updateTouchDevice);
});
</script>

<template>
  <span
    ref="textRef"
    class="group/underline relative inline-block cursor-pointer decoration-0"
    :class="{ 'is-visible': alwaysShowOnMobile && isTouchDevice }"
  >
    <span>{{ label }}</span>
    <span
      class="absolute left-1/2 block h-(--underline-height,0.1em) w-0 -translate-x-1/2 bg-current transition-[width] duration-250 ease-in-out -bottom-(--underline-padding,0.01em) group-hover/underline:w-full group-[.is-visible]/underline:w-full"
      aria-hidden="true"
    />
  </span>
</template>
