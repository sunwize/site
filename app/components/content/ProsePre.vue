<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    code?: string;
    language?: string;
    filename?: string;
    highlights?: number[];
    meta?: string;
    class?: string;
  }>(),
  {
    code: "",
    language: undefined,
    filename: undefined,
    highlights: () => [],
    meta: undefined,
    class: undefined,
  }
);

const copied = ref(false);
let resetCopiedTimer: ReturnType<typeof setTimeout> | undefined;

const label = computed(() => props.filename ?? props.language);

async function copyCode() {
  if (!props.code || import.meta.server) {
    return;
  }

  await navigator.clipboard.writeText(props.code);
  copied.value = true;

  if (resetCopiedTimer) {
    clearTimeout(resetCopiedTimer);
  }

  resetCopiedTimer = setTimeout(() => {
    copied.value = false;
  }, 1600);
}

onBeforeUnmount(() => {
  if (resetCopiedTimer) {
    clearTimeout(resetCopiedTimer);
  }
});
</script>

<template>
  <div class="code-block">
    <div v-if="label || code" class="code-block__header">
      <span v-if="label" class="code-block__label">{{ label }}</span>
      <span v-else aria-hidden="true" />

      <button
        v-if="code"
        class="code-block__copy"
        type="button"
        :aria-label="copied ? 'Copied code' : 'Copy code'"
        :title="copied ? 'Copied' : 'Copy'"
        @click="copyCode"
      >
        {{ copied ? "Copied" : "Copy" }}
      </button>
    </div>

    <pre :class="props.class"><slot /></pre>
  </div>
</template>
