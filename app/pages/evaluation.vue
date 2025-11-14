<script setup lang="ts">
import { Plus, Stars } from "lucide-vue-next";
import Page from "~/components/primitives/composing/Page.vue";
import type {
  GraphEvaluationConfig,
  ParagraphEvaluationConfig,
  ScoreEvaluationConfig,
} from "~~/shared/types/config/evaluations";
import ScoreEvaluation from "~/components/shared/evaluations/parts/ScoreEvaluation.vue";
import GraphEvaluation from "~/components/shared/evaluations/parts/GraphEvaluation.vue";
import ParagraphEvaluation from "~/components/shared/evaluations/parts/ParagraphEvaluation.vue";
import AddEvaluationSectionDropdownMenu from "~/components/shared/evaluations/AddEvaluationSectionDropdownMenu.vue";

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
      <template v-if="attributes.evaluations.length > 0">
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
      </template>
      <Empty v-else>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Stars />
          </EmptyMedia>
          <EmptyTitle>{{ $t("pages.evaluation.empty.title") }}</EmptyTitle>
          <EmptyDescription>{{ $t("pages.evaluation.empty.description") }}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <AddEvaluationSectionDropdownMenu
            side="bottom"
            align="center"
            @added="scroll"
          >
            <Button>
              <Plus />
              {{ $t("pages.evaluation.empty.button") }}
            </Button>
          </AddEvaluationSectionDropdownMenu>
        </EmptyContent>
      </Empty>

      <AddEvaluationSectionDropdownMenu @added="scroll">
        <Button
          size="icon-lg"
          class="size-14 rounded-full [&_>svg]:size-6! fixed bottom-6 right-6 z-50 transition-all"
          :class="{ 'bottom-0 translate-y-[100%]': !attributes.evaluations.length }"
        >
          <Plus />
        </Button>
      </AddEvaluationSectionDropdownMenu>
    </div>
    <div
      ref="bottomScroll"
      class="h-0"
    />
  </Page>
</template>
