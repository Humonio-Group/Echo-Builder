<script setup lang="ts">
import type {
  Evaluation,
  GraphEvaluationConfig,
  ParagraphEvaluationConfig,
  ScoreEvaluationConfig,
} from "#shared/types/config/evaluations";
import ParagraphEvaluation from "~/components/shared/evaluations/parts/ParagraphEvaluation.vue";
import ScoreEvaluation from "~/components/shared/evaluations/parts/ScoreEvaluation.vue";
import GraphEvaluation from "~/components/shared/evaluations/parts/GraphEvaluation.vue";
import { Star, Trash, ChartColumnBig, ChartNetwork, ChartSpline, Gauge, TextAlignStart, ChevronsDownUp, ChevronsUpDown } from "lucide-vue-next";

const evaluation = defineModel<Evaluation>("evaluation", { required: true });
const open = ref<boolean>(false);

const store = useBuilderStore();
</script>

<template>
  <Collapsible
    v-model:open="open"
    @update:open="open = $event"
  >
    <Card class="group/main">
      <CollapsibleTrigger as-child>
        <CardHeader class="flex items-center">
          <template v-if="evaluation.type === 'score'">
            <div class="mr-1 size-8 grid place-items-center rounded-md bg-muted [&_>svg]:size-4">
              <Gauge />
            </div>

            <CardTitle
              v-if="evaluation.type === 'score'"
              class="flex-1"
            >
              {{ $t(`pages.evaluation.type.${(evaluation.config as ScoreEvaluationConfig).mainScore ? "general-" : ""}score`) }}
            </CardTitle>

            <div class="flex items-center">
              <AlertDialog v-if="(evaluation.config as ScoreEvaluationConfig).mainScore">
                <Tooltip>
                  <TooltipTrigger as-child>
                    <AlertDialogTrigger as-child>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        class="text-destructive! md:opacity-0 group-hover/main:opacity-100"
                        @click.stop
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
                    <AlertDialogAction @click="store.removeEvaluation(evaluation.order)">
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
                    class="text-destructive! md:opacity-0 group-hover/main:opacity-100"
                    @click.stop="store.removeEvaluation(evaluation.order)"
                  >
                    <Trash />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {{ $t("labels.tooltips.delete-score") }}
                </TooltipContent>
              </Tooltip>

              <AlertDialog v-if="store.hasMainScore && !(evaluation.config as ScoreEvaluationConfig).mainScore">
                <Tooltip>
                  <TooltipTrigger as-child>
                    <AlertDialogTrigger as-child>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        @click.stop
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
                    <AlertDialogAction @click="store.makeMainScore(evaluation.order)">
                      {{ $t("alerts.other-main-score-in-use.confirm") }}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Tooltip v-else>
                <TooltipTrigger as-child>
                  <Button
                    size="icon-sm"
                    :variant="(evaluation.config as ScoreEvaluationConfig).mainScore ? 'default' : 'ghost'"
                    @click.stop="store.makeMainScore(evaluation.order)"
                  >
                    <Star />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {{ $t(`labels.tooltips.${(evaluation.config as ScoreEvaluationConfig).mainScore ? 'make-as-normal-score' : 'make-as-main-score'}`) }}
                </TooltipContent>
              </Tooltip>

              <Button
                size="icon-sm"
                variant="ghost"
              >
                <ChevronsDownUp v-if="open" />
                <ChevronsUpDown v-else />
              </Button>
            </div>
          </template>
          <template v-if="evaluation.type === 'paragraph'">
            <div class="mr-1 size-8 grid place-items-center rounded-md bg-muted [&_>svg]:size-4">
              <TextAlignStart />
            </div>

            <CardTitle class="flex-1">
              {{ $t("pages.evaluation.type.paragraph") }}
            </CardTitle>

            <div class="flex items-center">
              <Button
                size="icon-sm"
                variant="ghost"
                class="text-destructive! group-hover/main:opacity-100 opacity-100 md:opacity-0"
                @click="store.removeEvaluation(evaluation.order)"
              >
                <Trash />
              </Button>
              <Button
                size="icon-sm"
                variant="ghost"
              >
                <ChevronsDownUp v-if="open" />
                <ChevronsUpDown v-else />
              </Button>
            </div>
          </template>
          <template v-if="evaluation.type === 'graph'">
            <div class="mr-1 size-8 grid place-items-center rounded-md bg-muted [&_>svg]:size-4">
              <ChartColumnBig v-if="(evaluation.config as GraphEvaluationConfig).previewMode === 'bar'" />
              <ChartSpline v-if="(evaluation.config as GraphEvaluationConfig).previewMode === 'line'" />
              <ChartNetwork v-if="(evaluation.config as GraphEvaluationConfig).previewMode === 'spider'" />
            </div>

            <CardTitle class="flex-1">
              {{ $t(`pages.evaluation.type.graph.${(evaluation.config as GraphEvaluationConfig).previewMode}`) }}
            </CardTitle>

            <div class="flex items-center">
              <Button
                size="icon-sm"
                variant="ghost"
                class="text-destructive! group-hover/main:opacity-100 opacity-100 md:opacity-0"
                @click="store.removeEvaluation(evaluation.order)"
              >
                <Trash />
              </Button>
              <Button
                size="icon-sm"
                variant="ghost"
              >
                <ChevronsDownUp v-if="open" />
                <ChevronsUpDown v-else />
              </Button>
            </div>
          </template>
        </CardHeader>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <CardContent>
          <ScoreEvaluation
            v-if="evaluation.type === 'score'"
            v-model:method="evaluation.method"
            v-model:config="evaluation.config as ScoreEvaluationConfig"
            :order="evaluation.order"
          />
          <GraphEvaluation
            v-if="evaluation.type === 'graph'"
            v-model:method="evaluation.method"
            v-model:config="evaluation.config as GraphEvaluationConfig"
            :order="evaluation.order"
          />
          <ParagraphEvaluation
            v-if="evaluation.type === 'paragraph'"
            v-model:method="evaluation.method"
            v-model:config="evaluation.config as ParagraphEvaluationConfig"
            :order="evaluation.order"
          />
        </CardContent>
      </CollapsibleContent>
    </Card>
  </Collapsible>
</template>
