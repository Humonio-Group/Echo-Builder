<script setup lang="ts">
import { Plus, Gauge, TextAlignStart, ChartPie, ChartNetwork, ChartColumnBig, ChartSpline } from "lucide-vue-next";
import Page from "~/components/primitives/composing/Page.vue";
import type {
  GraphEvaluationConfig,
  ParagraphEvaluationConfig,
  ScoreEvaluationConfig,
} from "~~/shared/types/config/evaluations";
import ScoreEvaluation from "~/components/shared/evaluations/parts/ScoreEvaluation.vue";
import GraphEvaluation from "~/components/shared/evaluations/parts/GraphEvaluation.vue";
import ParagraphEvaluation from "~/components/shared/evaluations/parts/ParagraphEvaluation.vue";

definePageMeta({
  nameKey: "navigation.evaluation",
});

const bottomScroll = ref();

const builderStore = useBuilderStore();
const { attributes } = storeToRefs(builderStore);

function scroll() {
  setTimeout(() => bottomScroll.value!.scrollIntoView({ behavior: "smooth" }), 0);
}
</script>

<template>
  <Page
    name="evaluation"
    class="flex flex-col items-center"
  >
    <div class="w-full max-w-xl grid gap-6">
      <template
        v-for="(evaluation, index) in attributes.evaluations"
        :key="evaluation.order"
      >
        <Separator v-if="index > 0" />
        <ScoreEvaluation
          v-if="evaluation.type === 'score'"
          v-model:method="evaluation.method"
          v-model:config="evaluation.config as ScoreEvaluationConfig"
          :order="evaluation.order"
          :global="index === 0"
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
      </template>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button
            size="icon-lg"
            class="size-14 rounded-full [&_>svg]:size-6! fixed bottom-6 right-6 z-50"
          >
            <Plus />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          side="top"
        >
          <DropdownMenuGroup>
            <DropdownMenuItem
              @click="() => {
                builderStore.addEvaluation('score');
                scroll();
              }"
            >
              <Gauge />
              {{ $t("pages.evaluation.add-score") }}
            </DropdownMenuItem>
            <DropdownMenuItem
              @click="() => {
                builderStore.addEvaluation('paragraph');
                scroll();
              }"
            >
              <TextAlignStart />
              {{ $t("pages.evaluation.add-paragraph") }}
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <ChartPie />
                {{ $t("pages.evaluation.add-graph") }}
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    @click="() => {
                      builderStore.addEvaluation('graph', 'bar');
                      scroll();
                    }"
                  >
                    <ChartColumnBig />
                    {{ $t("pages.evaluation.type.graph.bar") }}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    @click="() => {
                      builderStore.addEvaluation('graph', 'line');
                      scroll();
                    }"
                  >
                    <ChartSpline />
                    {{ $t("pages.evaluation.type.graph.line") }}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    @click="() => {
                      builderStore.addEvaluation('graph', 'spider');
                      scroll();
                    }"
                  >
                    <ChartNetwork />
                    {{ $t("pages.evaluation.type.graph.spider") }}
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <div
      ref="bottomScroll"
      class="h-0"
    />
  </Page>
</template>
