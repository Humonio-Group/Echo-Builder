<script setup lang="ts">
import type { GraphEvaluation, GraphEvaluationConfig } from "~~/shared/types/config/evaluations";
import { Plus, Trash } from "lucide-vue-next";
import { NumberField } from "~/components/ui/number-field";

const { t, locale } = useI18n();

defineProps<{
  order: number;
}>();

const { languages } = storeToRefs(useBuilderStore());

const method = defineModel<GraphEvaluation["method"]>("method", { required: true });
const config = defineModel<GraphEvaluationConfig>("config", { required: true });
const invalidMethod = computed(() => method.value?.trim().length < 100);

function addAxis() {
  config.value.axes.push({
    ...languages.value.reduce((acc, val) => {
      acc[val] = `${t("labels.axis")} ${config.value.axes.length + 1}`;
      return acc;
    }, {} as Translations),
  });
}
function removeAxis(index: number) {
  config.value.axes.splice(index, 1);
}
</script>

<template>
  <section class="group grid gap-4">
    <div class="space-y-2">
      <div>
        <Label
          :for="`graph-${order}`"
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

            <NumberFieldInput :id="`graph-${order}-min`" />

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

            <NumberFieldInput :id="`graph-${order}-max`" />

            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
      </div>
    </div>

    <div class="grid gap-2">
      <div class="flex items-center justify-between">
        <Label>{{ $t("pages.evaluation.axis.axes") }}</Label>
        <Button
          size="icon-sm"
          variant="ghost"
          @click="addAxis"
        >
          <Plus />
        </Button>
      </div>
      <template v-if="config.axes.length">
        <div
          v-for="(_, index) in config!.axes"
          :key="`graph-${order}-axis-${index}`"
          class="group/input relative"
        >
          <Input
            :model-value="config!.axes[index]![locale]"
            @update:model-value="val => config!.axes[index][locale] = val ?? ''"
          />
          <Button
            tabindex="-1"
            size="icon-sm"
            variant="ghost"
            class="text-destructive! absolute top-0.5 right-0.5 md:opacity-0 group-hover/input:opacity-100"
            @click="removeAxis(index)"
          >
            <Trash />
          </Button>
        </div>
      </template>
      <Empty v-else>
        <EmptyHeader>
          <EmptyTitle>
            {{ $t("pages.evaluation.axis.empty.title") }}
          </EmptyTitle>
          <EmptyDescription>
            {{ $t("pages.evaluation.axis.empty.description") }}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button @click="addAxis">
            <Plus />
            {{ $t("pages.evaluation.axis.empty.button") }}
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  </section>
</template>
