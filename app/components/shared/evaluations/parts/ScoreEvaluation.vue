<script setup lang="ts">
import type { ScoreEvaluation } from "~~/shared/types/config/evaluations";
import { NumberField } from "~/components/ui/number-field";

withDefaults(defineProps<{
  order: number;
  hasOtherGlobal?: boolean;
}>(), {
  hasOtherGlobal: false,
});

const builderStore = useBuilderStore();

const method = defineModel<ScoreEvaluation["method"]>("method", { required: true });
const config = defineModel<ScoreEvaluation["config"]>("config", { required: true });

const invalidMethod = computed(() => method.value?.trim().length < 100);
</script>

<template>
  <section class="grid gap-4">
    <div class="space-y-2">
      <div>
        <Label
          :for="`score-${order}`"
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

    <div class="grid md:grid-cols-2 gap-4">
      <div class="space-y-2">
        <Label>{{ $t("pages.evaluation.axis.min-value") }}</Label>

        <NumberField
          :max="config!.max"
          :model-value="config!.min"
          @update:model-value="val => config!.min = val ?? 0"
        >
          <NumberFieldContent>
            <NumberFieldDecrement />

            <NumberFieldInput :id="`score-${order}-min`" />

            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
      </div>
      <div class="space-y-2">
        <Label>{{ $t("pages.evaluation.axis.max-value") }}</Label>

        <NumberField
          :min="config!.min"
          :model-value="config!.max"
          @update:model-value="val => config!.max = val ?? 0"
        >
          <NumberFieldContent>
            <NumberFieldDecrement />

            <NumberFieldInput :id="`score-${order}-max`" />

            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
      </div>
    </div>
  </section>
</template>
