<script setup lang="ts">
import type { PrepQuestionText } from "#shared/types/config/prep-questions";

defineProps<{
  order: number;
}>();

const question = defineModel<PrepQuestionText>("question", { required: true });
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

    <div class="flex items-center justify-between gap-4">
      <Label :for="`range-${order}-length`">
        {{ $t("pages.customize.fields.max-length") }}
      </Label>
      <NumberField
        :min="1"
        :max="question.type === 'short' ? 255 : 2048"
        :model-value="question.config.maxLength"
        @update:model-value="val => question.config.maxLength = val ?? 1"
      >
        <NumberFieldContent>
          <NumberFieldDecrement />

          <NumberFieldInput :id="`range-${order}-length`" />

          <NumberFieldIncrement />
        </NumberFieldContent>
      </NumberField>
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
