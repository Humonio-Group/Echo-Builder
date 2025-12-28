<script setup lang="ts">
import { Minus, Plus } from "lucide-vue-next";
import type { PrepQuestionSelect } from "#shared/types/config/prep-questions";

const { t, locale } = useI18n();

defineProps<{
  order: number;
}>();

const question = defineModel<PrepQuestionSelect>("question", { required: true });
const { languages } = storeToRefs(useBuilderStore());

function addOption() {
  question.value.config.options.push({
    ...languages.value.reduce((acc, val) => {
      acc[val] = t("labels.option-placeholder");
      return acc;
    }, {} as Translations),
  });
}
function removeOption(index: number) {
  question.value.config.options.splice(index, 1);
}
</script>

<template>
  <section class="grid gap-4">
    <div class="space-y-2">
      <Label :for="`range-${order}`">{{ $t("pages.customize.fields.label") }}</Label>
      <Input
        :id="`range-${order}`"
        v-model="question.label[locale]"
        class="w-full"
      />
    </div>

    <div class="grid gap-2">
      <div class="flex items-center justify-between gap-2">
        <Label>{{ $t("pages.customize.fields.options") }}</Label>
        <Button
          size="icon-sm"
          variant="ghost"
          @click="addOption"
        >
          <Plus />
        </Button>
      </div>

      <div
        v-for="(_, index) in question.config.options"
        :key="`select-${order}-option-${index}`"
        class="group relative"
      >
        <Input
          v-model="question.config.options[index]![locale]"
          :class="{ 'border-destructive!': !question.config.options[index]![locale]!.trim().length }"
        />
        <Button
          v-if="question.config.options.length > 2"
          size="icon-sm"
          variant="ghost"
          class="absolute top-0.5 right-0.5 md:opacity-0 group-hover:opacity-100"
          @click="removeOption(index)"
        >
          <Minus />
        </Button>
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
