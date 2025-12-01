<script setup lang="ts">
import type { PrepQuestionRange } from "#shared/types/config/prep-questions";

defineProps<{
  order: number;
}>();

const question = defineModel<PrepQuestionRange>("question", { required: true });
</script>

<template>
  <section class="grid gap-4">
    <div class="space-y-2">
      <Label :for="`range-${order}`">{{ $t("pages.customize.fields.label") }}</Label>
      <Input
        :id="`range-${order}`"
        v-model="question.label"
        class="w-full"
      />
    </div>

    <div class="grid md:grid-cols-2 gap-4">
      <div class="space-y-2">
        <Label :for="`range-${order}-min`">
          {{ $t("pages.customize.fields.min-value") }}
        </Label>
        <NumberField
          :min="0"
          :max="question.config.max ?? 10"
          :model-value="question.config.min"
          @update:model-value="val => question.config.min = val ?? 0"
        >
          <NumberFieldContent>
            <NumberFieldDecrement />

            <NumberFieldInput :id="`range-${order}-min`" />

            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
      </div>
      <div class="space-y-2">
        <Label :for="`range-${order}-max`">
          {{ $t("pages.customize.fields.max-value") }}
        </Label>
        <NumberField
          :min="question.config.min ?? 0"
          :max="100"
          :model-value="question.config.max"
          @update:model-value="val => question.config.max = val ?? 0"
        >
          <NumberFieldContent>
            <NumberFieldDecrement />

            <NumberFieldInput :id="`range-${order}-min`" />

            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
      </div>
    </div>

    <div class="flex items-center justify-between gap-3">
      <Label
        class="flex-1"
        :for="`range-${order}-required`"
      >
        {{ $t("pages.customize.fields.make-required") }}
      </Label>
      <Switch
        :id="`range-${order}-required`"
        :model-value="question.required"
        @update:model-value="val => question.required = val"
      />
    </div>
  </section>
</template>
