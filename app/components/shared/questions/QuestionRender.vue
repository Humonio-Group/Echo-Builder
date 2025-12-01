<script setup lang="ts">
import type {
  PrepQuestion,
  PrepQuestionRange,
  PrepQuestionSelect,
  PrepQuestionText,
} from "#shared/types/config/prep-questions";
import TextQuestion from "~/components/shared/questions/parts/TextQuestion.vue";
import { SquareMousePointer, GitCommitHorizontal, TextAlignStart, TextWrap, ChevronsUpDown, ChevronsDownUp, Trash } from "lucide-vue-next";
import RangeQuestion from "~/components/shared/questions/parts/RangeQuestion.vue";
import SelectQuestion from "~/components/shared/questions/parts/SelectQuestion.vue";
import { Collapsible } from "~/components/ui/collapsible";

const question = defineModel<PrepQuestion>("question", { required: true });
const open = ref<boolean>(false);

const store = useBuilderStore();
</script>

<template>
  <Collapsible v-model:open="open">
    <Card class="group/main">
      <CollapsibleTrigger as-child>
        <CardHeader class="flex items-center">
          <div class="mr-1 [&_>svg]:size-4 size-8 grid place-items-center rounded-md bg-muted">
            <TextAlignStart v-if="question.type === 'short'" />
            <TextWrap v-if="question.type === 'long'" />
            <SquareMousePointer v-if="question.type === 'select'" />
            <GitCommitHorizontal v-if="question.type === 'range'" />
          </div>

          <CardTitle class="text-normal flex-1">
            {{ question.label }}
          </CardTitle>

          <div class="flex items-center">
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  size="icon-sm"
                  variant="link"
                  class="text-destructive! md:opacity-0 group-hover/main:opacity-100"
                  @click.stop="store.removeQuestion(question.order)"
                >
                  <Trash />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {{ $t(`labels.tooltips.delete-${question.type}`) }}
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
        </CardHeader>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <CardContent>
          <TextQuestion
            v-if="['short', 'long'].includes(question.type)"
            v-model:question="question as PrepQuestionText"
            :order="question.order"
          />
          <SelectQuestion
            v-if="question.type === 'select'"
            v-model:question="question as PrepQuestionSelect"
            :order="question.order"
          />
          <RangeQuestion
            v-if="question.type === 'range'"
            v-model:question="question as PrepQuestionRange"
            :order="question.order"
          />
        </CardContent>
      </CollapsibleContent>
    </Card>
  </Collapsible>
</template>
