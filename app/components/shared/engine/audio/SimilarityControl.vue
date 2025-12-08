<script setup lang="ts">
import { Info } from "lucide-vue-next";

const { attributes } = storeToRefs(useBuilderStore());
</script>

<template>
  <div class="space-y-2">
    <Label class="flex items-center gap-2">
      {{ $t("pages.engine.audio.similarity.label") }}

      <Tooltip>
        <TooltipTrigger>
          <Info class="size-3 text-muted-foreground" />
        </TooltipTrigger>
        <TooltipContent>
          {{ $t("pages.engine.audio.similarity.tooltip") }}
        </TooltipContent>
      </Tooltip>
    </Label>

    <Slider
      :min="0"
      :max="1"
      :step="0.01"
      :model-value="[attributes.config.audio.similarity]"
      :default-value="[attributes.config.audio.similarity]"
      @update:model-value="attributes.config.audio.similarity = $event?.[0] ?? 0.5"
    />

    <div class="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
      <span>
        {{ $t("pages.engine.audio.similarity.low") }}
      </span>
      <span class="text-end">
        {{ $t("pages.engine.audio.similarity.high") }}
      </span>
    </div>
  </div>
</template>
