<script setup lang="ts">
import { SquareMousePointer, GitCommitHorizontal, TextAlignStart, TextWrap } from "lucide-vue-next";
import type { PrepQuestionType } from "#shared/types/config/prep-questions";

withDefaults(defineProps<{
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}>(), {
  side: "top",
  align: "end",
});

const emit = defineEmits<{
  added: [];
}>();

const store = useBuilderStore();

function addQuestion(type: PrepQuestionType) {
  store.addQuestion(type);
  emit("added");
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <slot />
    </DropdownMenuTrigger>
    <DropdownMenuContent
      :side
      :align
    >
      <DropdownMenuGroup>
        <DropdownMenuItem @click="addQuestion('short')">
          <TextAlignStart />
          {{ $t("pages.customize.type.short") }}
        </DropdownMenuItem>
        <DropdownMenuItem @click="addQuestion('long')">
          <TextWrap />
          {{ $t("pages.customize.type.long") }}
        </DropdownMenuItem>
        <DropdownMenuItem @click="addQuestion('select')">
          <SquareMousePointer />
          {{ $t("pages.customize.type.select") }}
        </DropdownMenuItem>
        <DropdownMenuItem @click="addQuestion('range')">
          <GitCommitHorizontal />
          {{ $t("pages.customize.type.range") }}
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
