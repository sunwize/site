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
    highlights: () => [],
  }
);

const copied = ref(false);
let resetCopiedTimer: ReturnType<typeof setTimeout> | undefined;

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
    <button
      v-if="code"
      class="code-block__copy"
      :class="{ 'is-visible': copied }"
      type="button"
      :aria-label="copied ? 'Copied code' : 'Copy code'"
      :title="copied ? 'Copied' : 'Copy'"
      @click="copyCode"
    >
      <Icon
        :name="copied ? 'lucide:check' : 'lucide:copy'"
        class="size-4"
        aria-hidden="true"
      />
    </button>

    <pre :class="props.class"><slot /></pre>
  </div>
</template>
