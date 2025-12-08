<script setup lang="ts">
import { useClipboard } from "@vueuse/core";
import { Check, Copy } from "lucide-vue-next";

interface VariableItemProps {
  label: string;
  description: string;
  value?: string;
}

const props = defineProps<VariableItemProps>();
const { copy, copied } = useClipboard();

const placeholder = computed(() => `{{${props.label}}}`);
</script>

<template>
  <div class="flex items-start gap-2">
    <Button
      variant="link"
      class="p-0! h-auto! font-bold! text-foreground!"
      @click="copy(placeholder)"
    >
      {{ placeholder }}

      <Check
        v-if="copied"
        class="size-3!"
      />
      <Copy
        v-else
        class="size-3!"
      />
    </Button>

    <span class="block w-[1.2ch] h-[2px] bg-foreground/20 rounded-full mt-2.25" />

    <div class="grid">
      <span class="text-muted-foreground italic">{{ description }}</span>
      <span
        v-if="value"
        class="text-sm text-muted-foreground italic"
      >{{ value }}</span>
    </div>
  </div>
</template>
