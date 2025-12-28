<script setup lang="ts">
import { Info } from "lucide-vue-next";

const { attributes } = storeToRefs(useBuilderStore());
</script>

<template>
  <div class="space-y-2">
    <div class="flex items-center justify-between gap-4">
      <Label class="flex items-center gap-2">
        {{ $t("pages.engine.audio.exageration.label") }}

        <Tooltip>
          <TooltipTrigger>
            <Info class="size-3 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>
            {{ $t("pages.engine.audio.exageration.tooltip") }}
          </TooltipContent>
        </Tooltip>
      </Label>

      <span class="text-sm">
        {{ (attributes.config.audio.exageration * 100).toFixed(0) }}%
      </span>
    </div>

    <Slider
      :min="0"
      :max="1"
      :step="0.01"
      :model-value="[attributes.config.audio.exageration]"
      :default-value="[attributes.config.audio.exageration]"
      @update:model-value="attributes.config.audio.exageration = $event?.[0] ?? 0.5"
    />

    <div class="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
      <span>
        {{ $t("pages.engine.audio.exageration.none") }}
      </span>
      <span class="text-end">
        {{ $t("pages.engine.audio.exageration.amplified") }}
      </span>
    </div>
  </div>
</template>
