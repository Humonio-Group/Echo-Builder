<script setup lang="ts">
import { cn } from "~/lib/utils";
import type { HTMLAttributes } from "vue";

const props = withDefaults(defineProps<{
  name?: string;
  class?: HTMLAttributes["class"];
}>(), {
  name: "default",
});
</script>

<template>
  <div
    :data-layout="name"
    :class="cn('', props.class)"
  >
    <slot />
  </div>
</template>
