<script setup lang="ts">
import type { ParagraphEvaluation } from "~~/shared/types/config/evaluations";

defineProps<{
  order: number;
}>();

const method = defineModel<ParagraphEvaluation["method"]>("method", { required: true });
const config = defineModel<ParagraphEvaluation["config"]>("config", { required: true });

const invalidMethod = computed(() => method.value?.trim().length < 100);
const invalidWriting = computed(() => config.value.writingMethod.trim().length < 100);
</script>

<template>
  <section class="group grid gap-4">
    <div class="space-y-2">
      <div>
        <Label
          :for="`paragraph-${order}-method`"
          :class="{ 'text-destructive': invalidMethod }"
        >{{ $t("pages.evaluation.evaluation-method.label") }}</Label>
        <span class="text-sm text-muted-foreground">{{ $t("pages.evaluation.evaluation-method.description") }}</span>
      </div>

      <div class="relative">
        <Textarea
          v-model="method"
          class="min-h-48 resize-y"
          :class="{ 'border-destructive': invalidMethod } "
        />

        <span
          v-if="invalidMethod"
          class="text-destructive absolute bottom-2 right-2 text-xs"
        >
          {{ method.length ?? 0 }} / 100
        </span>
        <span
          v-else
          class="text-muted-foreground absolute bottom-2 right-2 text-xs"
        >
          {{ method.length ?? 0 }}
        </span>
      </div>
    </div>

    <div class="space-y-2">
      <div>
        <Label
          :for="`paragraph-${order}-writing`"
          :class="{ 'text-destructive': invalidWriting }"
        >{{ $t("pages.evaluation.writing-method.label") }}</Label>
        <span class="text-sm text-muted-foreground">{{ $t("pages.evaluation.writing-method.description") }}</span>
      </div>

      <div class="relative">
        <Textarea
          v-model="config.writingMethod"
          class="min-h-48 resize-y"
          :class="{ 'border-destructive': invalidWriting } "
        />

        <span
          v-if="invalidWriting"
          class="text-destructive absolute bottom-2 right-2 text-xs"
        >
          {{ config.writingMethod.length ?? 0 }} / 100
        </span>
        <span
          v-else
          class="text-muted-foreground absolute bottom-2 right-2 text-xs"
        >
          {{ config.writingMethod.length ?? 0 }}
        </span>
      </div>
    </div>
  </section>
</template>
