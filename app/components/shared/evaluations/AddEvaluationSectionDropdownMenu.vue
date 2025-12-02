<script setup lang="ts">
import { ChartColumnBig, ChartNetwork, ChartPie, ChartSpline, Gauge, TextAlignStart } from "lucide-vue-next";

defineEmits<{
  added: [];
}>();
withDefaults(defineProps<{
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}>(), {
  side: "top",
  align: "end",
});

const builderStore = useBuilderStore();
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <slot />
    </DropdownMenuTrigger>
    <DropdownMenuContent
      :side="side"
      :align="align"
    >
      <DropdownMenuGroup>
        <DropdownMenuItem
          @click="() => {
            builderStore.addEvaluation('score');
            $emit('added');
          }"
        >
          <Gauge />
          {{ $t("pages.evaluation.add-score") }}
        </DropdownMenuItem>
        <DropdownMenuItem
          @click="() => {
            builderStore.addEvaluation('paragraph');
            $emit('added');
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
              <!-- <DropdownMenuItem
                @click="() => {
                  builderStore.addEvaluation('graph', 'bar');
                  $emit('added');
                }"
              >
                <ChartColumnBig />
                {{ $t("pages.evaluation.type.graph.bar") }}
              </DropdownMenuItem>
              <DropdownMenuItem
                @click="() => {
                  builderStore.addEvaluation('graph', 'line');
                  $emit('added');
                }"
              >
                <ChartSpline />
                {{ $t("pages.evaluation.type.graph.line") }}
              </DropdownMenuItem> -->
              <DropdownMenuItem
                @click="() => {
                  builderStore.addEvaluation('graph', 'spider');
                  $emit('added');
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
</template>
