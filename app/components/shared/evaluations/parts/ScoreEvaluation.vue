<script setup lang="ts">
import { Star, Trash } from "lucide-vue-next";
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
const global = computed(() => config.value.mainScore);
const shouldConfirmStar = computed(() => builderStore.hasMainScore && !config.value.mainScore);
</script>

<template>
  <section class="group grid gap-4">
    <header class="flex items-center justify-between gap-4">
      <h2 class="text-xl font-extrabold">
        {{ $t(`pages.evaluation.type.${global ? "general-" : ""}score`) }}
      </h2>

      <div class="flex items-center gap-1 group-hover:opacity-100 opacity-100 md:opacity-0">
        <AlertDialog v-if="shouldConfirmStar">
          <Tooltip>
            <TooltipTrigger as-child>
              <AlertDialogTrigger as-child>
                <Button
                  size="icon-sm"
                  variant="ghost"
                >
                  <Star />
                </Button>
              </AlertDialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              {{ $t("labels.tooltips.make-as-main-score") }}
            </TooltipContent>
          </Tooltip>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {{ $t("alerts.other-main-score-in-use.title") }}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {{ $t("alerts.other-main-score-in-use.description") }}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>
                {{ $t("alerts.other-main-score-in-use.cancel") }}
              </AlertDialogCancel>
              <AlertDialogAction @click="builderStore.makeMainScore(order)">
                {{ $t("alerts.other-main-score-in-use.confirm") }}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Tooltip v-else>
          <TooltipTrigger as-child>
            <Button
              size="icon-sm"
              :variant="config.mainScore ? 'default' : 'ghost'"
              @click="builderStore.makeMainScore(order)"
            >
              <Star />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {{ $t(`labels.tooltips.${global ? 'make-as-normal-score' : 'make-as-main-score'}`) }}
          </TooltipContent>
        </Tooltip>

        <AlertDialog v-if="global">
          <Tooltip>
            <TooltipTrigger as-child>
              <AlertDialogTrigger as-child>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  class="text-destructive!"
                >
                  <Trash />
                </Button>
              </AlertDialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              {{ $t("labels.tooltips.delete-score") }}
            </TooltipContent>
          </Tooltip>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {{ $t("alerts.delete-main-score.title") }}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {{ $t("alerts.delete-main-score.description") }}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                {{ $t("alerts.delete-main-score.cancel") }}
              </AlertDialogCancel>
              <AlertDialogAction @click="builderStore.removeEvaluation(order)">
                {{ $t("alerts.delete-main-score.confirm") }}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Tooltip v-else>
          <TooltipTrigger as-child>
            <Button
              size="icon-sm"
              variant="ghost"
              class="text-destructive!"
              @click="builderStore.removeEvaluation(order)"
            >
              <Trash />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {{ $t("labels.tooltips.delete-score") }}
          </TooltipContent>
        </Tooltip>
      </div>
    </header>

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
